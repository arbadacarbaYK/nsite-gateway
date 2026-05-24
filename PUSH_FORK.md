# Push to arbadacarbaYK/nsite-gateway

Use the **nsite-gateway deploy key** (not the default `github.com` host — SSH agent may offer the gittr key first and push will fail).

```bash
cd /path/to/nsite-gateway-pr
git remote set-url fork git@github.com-nsite-gateway:arbadacarbaYK/nsite-gateway.git
git push fork master
```

Requires `~/.ssh/config`:

```
Host github.com-nsite-gateway
    HostName github.com
    User git
    IdentityFile ~/.ssh/nsite-gateway-deploy-today
    IdentitiesOnly yes
```

Branch **`master`** is what production builds (`scripts/deploy-nsite-gateway.sh`).
