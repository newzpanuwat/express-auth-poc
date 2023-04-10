# express-auth-poc
POC Auth
- Auth jwt
- express


# Run
```
yarn start-dev
```

# Endpoints
```
# Login
/api/v1/login

#Profile
/api/v1/profile

# Test
/api/v1/test
```

# Remark
- This token will expire in 60s becareful when use it


# Example
```
# Login
curl -d '{"user": { "id": "002", "email": "dev@dev.com" } }' -H "Content-Type: application/json" -X POST https://auth-poc-ten.vercel.app/api/v1/login

# Profile
curl https://auth-poc-ten.vercel.app/api/v1/profile -H "Accept: application/json" -H "Authorization: Bearer {token}"
```


