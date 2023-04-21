# express-auth-poc

POC Auth

- Auth jwt
- express
- HMAC algo

# Run

```
yarn start-dev
```

# Endpoints

```
# Login
/auth/login

# get token
/auth/refresh

#Profile
/api/v1/profile

# Test
/api/v1/test
```

# Remark

- This token will expire in 120s becareful when use it

# Example

```
# Login
curl -d '{"user": { "id": "01", "email": "dev@idev.com" } }' -H "Content-Type: application/json" -X POST https://auth-poc-ten.vercel.app/auth/login

# Profile
curl https://auth-poc-ten.vercel.app/api/v1/profile -H "Accept: application/json" -H "Authorization: Bearer {token}"
```
