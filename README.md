# API

## Base URL
```
https://server-jobs-pot.vercel.app/
```

# Sign Up

### End Point
```
user/signup
```
### Method
**`POST`**
###  Parameter
- **`userName`** - ***Required***

    Type: **Sting**
- **`email`** - ***Required***

    Type: **Sting** 
- **`password`** - ***Required***

    Type: **Sting**

    Recommend: ***encryption***
###  Successful Response

```
{
    "results": {
        "userName": "Thành Nguyễn",
        "email": "thanhjang2k@gmail.com",
        "id": "648fce01126eab64c09842ee"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5oamFuZzJrQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTI3YjUwZGU2ZDAwNTRhYjAyNzI5MTUyZDNiMTMyNTQ3ODE1OTczNDMxNDNiZjM0MWE0YjIyMzMwMWExNGI5YyIsImlhdCI6MTY4NzE0NTk4NSwiZXhwIjoxNjg3MTQ5NTg1fQ.Ymrcu9ymfQ6x0sJhTAunXrkL0IeszhVbxwJmbIGVZk4",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5oamFuZzJrQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTI3YjUwZGU2ZDAwNTRhYjAyNzI5MTUyZDNiMTMyNTQ3ODE1OTczNDMxNDNiZjM0MWE0YjIyMzMwMWExNGI5YyIsImlhdCI6MTY4NzE0NTk4NSwiZXhwIjoxNjg4MDA5OTg1fQ.CRrxdogecX_boy6O7YKwciI2nEeUPYRDHLcxcmS6wwE",
    "msg": "Sign Up Successfully!"
}
```
### Error Response

- **`Email registered`**
    ```
    {
        "msg": "Email registered!"
    }
    ```
- **`Field required`**
    ```
    {
        "msg": "userName field is required"
    }
    ```
    ```
    {
        "msg": "email field is required"
    }
    ```
    ```
    {
        "password": "userName field is required"
    }
    ```
# Sign In

### End Point
```
user/signin
```
### Method
**`POST`**
### Parameter
- **`email`** - ***Required***

    Type: **Sting**
- **`password`** - ***Required***

    Type: **Sting**

    Recommend: ***encryption***
###  Successful Response

```
{
    "results": {
        "userName": "thanhnguyen",
        "email": "thanhnguyen@gmail.com",
        "id": "649112b088811c97547310dd"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obmd1eWVuQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTI3YjUwZGU2sDAwNTRhYjAyNzI5MTUyZDNiMTMyNTQ3ODE1OTczNDMxNDNiZjM0MWE0YjIyMzMwMWExNGI5YyIsImlhdCI6MTY4NzIzNTc1OCwiZXhwIjoxNjg3MjM5MzU4fQ.GjjMxtm0iCK_FAjnp75ASSIdS9uT35NZPIC6FllxQuo",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5Dbmd1eWVuQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTI3YjUwZGU2ZDAwNTRhYjAyNzI5MTUyZDNiMTMyNTQ3ODE1OTczNDMxNDNiZjM0MWE0YjIyMzMwMWExNGI5YyIsImlhdCI6MTY4NzIzNTc1OCwiZXhwIjoxNjg4MDk5NzU4fQ.Ii7Q77Y2TcVb-RP8GjD97N3wxMIejiXFczB2OjeTrCk",
    "msg": "Login Successfully!"
}
```
### Error Response

- **`Incorrect account information`**
    ```
    {
        "msg": "Incorrect account information!"
    }
    ```
- **`Field required`**
    ```
    {
        "msg": "email field is required"
    }
    ```
    ```
    {
        "password": "userName field is required"
    }
    ```