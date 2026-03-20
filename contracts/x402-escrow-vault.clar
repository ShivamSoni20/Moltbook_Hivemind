;; x402-escrow-vault.clar
;; Escrow vault handling locking and releasing sBTC and USDCx for x402 payments.

(define-constant err-unauthorized (err u200))
(define-constant err-insufficient-funds (err u201))
(define-constant err-vault-empty (err u202))
(define-constant err-invalid-amount (err u203))
(define-constant err-invalid-token (err u204))

;; Token addresses (assuming same testnet deployer for now, using ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant sbtc-addr 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token)
(define-constant usdcx-addr 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx-token)

;; Storage 
(define-map vault-balances 
  uint 
  { 
    amount: uint, 
    token: (string-ascii 10), 
    poster: principal 
  }
)

;; Only the job registry can call these functions
(define-private (is-authorized)
  (is-eq tx-sender .job-registry)
)

(define-public (lock-sbtc (job-id uint) (amount uint))
  (let 
    (
      (poster tx-sender)
    )
    (asserts! (> amount u0) err-invalid-amount)
    
    ;; In real clarity, we'd use contract-call? with the full principal trait or hardcode path
    ;; Since this is SIP-010, `transfer` signature is typically (amount sender recipient memo)
    (try! (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token transfer amount poster (as-contract tx-sender) none))
    
    (map-set vault-balances job-id { amount: amount, token: "sBTC", poster: poster })
    (print { event: "lock-sbtc", job-id: job-id, amount: amount, poster: poster })
    (ok true)
  )
)

(define-public (lock-usdcx (job-id uint) (amount uint))
  (let 
    (
      (poster tx-sender)
    )
    (asserts! (> amount u0) err-invalid-amount)
    
    (try! (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx-token transfer amount poster (as-contract tx-sender) none))
    
    (map-set vault-balances job-id { amount: amount, token: "USDCx", poster: poster })
    (print { event: "lock-usdcx", job-id: job-id, amount: amount, poster: poster })
    (ok true)
  )
)

(define-public (release-payment (job-id uint) (recipient principal))
  (let 
    (
      (vault (unwrap! (map-get? vault-balances job-id) err-vault-empty))
      (amount (get amount vault))
      (token (get token vault))
    )
    (asserts! (is-authorized) err-unauthorized)
    
    (if (is-eq token "sBTC")
        (try! (as-contract (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token transfer amount tx-sender recipient none)))
        (try! (as-contract (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx-token transfer amount tx-sender recipient none)))
    )
    
    (map-delete vault-balances job-id)
    (print { event: "release-payment", job-id: job-id, recipient: recipient, amount: amount, token: token })
    (ok true)
  )
)

(define-public (refund-poster (job-id uint))
  (let 
    (
      (vault (unwrap! (map-get? vault-balances job-id) err-vault-empty))
      (poster (get poster vault))
      (amount (get amount vault))
      (token (get token vault))
    )
    (asserts! (or (is-authorized) (is-eq tx-sender poster)) err-unauthorized)
    
    (if (is-eq token "sBTC")
        (try! (as-contract (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token transfer amount tx-sender poster none)))
        (try! (as-contract (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx-token transfer amount tx-sender poster none)))
    )
    
    (map-delete vault-balances job-id)
    (print { event: "refund-poster", job-id: job-id, poster: poster, amount: amount })
    (ok true)
  )
)
