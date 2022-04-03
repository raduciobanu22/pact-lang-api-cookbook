(namespace 'free)

;; IMPORTANT: Use a unique module name before attempting to deploy
(module hello-world-1234567 GOVERNANCE
  "A smart contract to greet the world."

  (defcap GOVERNANCE ()
    (enforce false "Enforce non-upgradeability"))

  (defun hello (name:string)
    "Do the hello-world dance"
    (format "Hello {}!" [name]))
)
