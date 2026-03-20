;; agent-registry.clar
;; Stores agent identities and reputation

(define-constant err-unauthorized (err u300))
(define-constant err-agent-exists (err u301))
(define-constant err-agent-not-found (err u302))

;; Storage maps needed
(define-map agents-map
  uint
  {
    name: (string-ascii 50),
    skill-tags: (string-ascii 200),
    wallet: principal,
    jobs-completed: uint,
    total-earned: uint,
    reputation-score: uint
  }
)

(define-map principal-to-agent
  principal
  uint
)

(define-data-var last-agent-id uint u0)

;; SIP-009 Compatible Reputation NFT Data
(define-non-fungible-token agent-reputation uint)
(define-data-var next-nft-id uint u1)

;; Only job registry authorized to mint reputation
(define-private (is-job-registry)
  (is-eq tx-sender .job-registry)
)

(define-public (register-agent (name (string-ascii 50)) (skill-tags (string-ascii 200)) (wallet principal))
  (let 
    (
      (new-agent-id (+ (var-get last-agent-id) u1))
    )
    (asserts! (is-none (map-get? principal-to-agent wallet)) err-agent-exists)
    
    (map-set agents-map new-agent-id {
      name: name,
      skill-tags: skill-tags,
      wallet: wallet,
      jobs-completed: u0,
      total-earned: u0,
      reputation-score: u0
    })
    
    (map-set principal-to-agent wallet new-agent-id)
    (var-set last-agent-id new-agent-id)
    
    (print { event: "agent-registered", id: new-agent-id, name: name, wallet: wallet })
    (ok new-agent-id)
  )
)

(define-read-only (get-agent-stats (agent-id uint))
  (map-get? agents-map agent-id)
)

(define-read-only (get-agent-by-principal (wallet principal))
  (map-get? principal-to-agent wallet)
)

(define-public (mint-reputation-nft (agent-id uint) (job-id uint))
  (let 
    (
      (agent (unwrap! (map-get? agents-map agent-id) err-agent-not-found))
      (nft-id (var-get next-nft-id))
    )
    (asserts! (is-job-registry) err-unauthorized)
    
    ;; Mint NFT directly to agent's wallet
    (try! (nft-mint? agent-reputation nft-id (get wallet agent)))
    
    ;; Update agent stats
    (map-set agents-map agent-id (merge agent {
      jobs-completed: (+ (get jobs-completed agent) u1),
      reputation-score: (+ (get reputation-score agent) u1)
    }))
    
    (var-set next-nft-id (+ nft-id u1))
    
    (print { event: "reputation-minted", agent-id: agent-id, job-id: job-id, nft-id: nft-id })
    (ok true)
  )
)

(define-read-only (get-top-agents (limit uint))
  ;; Returns stub response as Clarity does not support generic dynamic map iteration
  ;; for sorting on-chain. Off-chain indexer must handle leaderboard sorting.
  (ok "Leaderboard: Please refer to off-chain indexer for sorted list based on reputation-score")
)
