# Basic server

[Postman collection](https://github.com/thanhnv-dev/basic-server/blob/main/postman_collection.json)

## Contents

- [Notes](#notes)
- [Base URL](#base-url)
- [Sign Up](#sign-up)
- [Sign In](#sign-in)
- [Profile](#profile)
- [Refresh Token](#refresh-token)
- [Custom Token](#custom-token)
- [Delete](#delete)
- [Send Verification Code](#send-verification-code)
- [Verify code](#verify-code)

# Notes

### Api `send-verification-code` and `verify-code`

| Case                                                                                                                                                   | Note                                                                                                              |
| :----------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| - The email sent to the `send-verification-code` api has been `sign-up`<br/> - Never `verify-code` or field `isVerifiedEmail` in user data is `false`  | - When verification is successful(`verify-code`), field `isVerifiedEmail` in user data will be changed to `true`. |
| - The email sent to the `send-verification-code` api has been `sign-up`<br/> - Already `verify-code` or field `isVerifiedEmail` in user data is `true` | - Sending the request will fail because the email has already been verified.                                      |
| - The email sent to the `send-verification-code` api has not been `sign-up`                                                                            | -This process will be separate from user data and will not change user data because the email is not `sign-up`    |

### Status codes

| Case               | Status code | Note         |
| :----------------- | :---------- | :----------- |
| Susccess           | 200         |              |
| Failed             | 400         |              |
| Tokens expire      | 401         | Unauthorized |
| Token is incorrect | 403         | Forbidden    |

# Base URL

```
https://common-api-v1.vercel.app/
```

# Sign Up

> Use to create new account

### End Point

`user/sign-up`

### Method

**`POST`**

### Parameters

| Field Name    | Requirements                                                  | Note                   |
| :------------ | :------------------------------------------------------------ | :--------------------- |
| `userName`    | - Required <br/> - `String` type <br/> - Min length is 3 type |                        |
| `email`       | - Required <br/> - `Email` type                               |                        |
| `password`    | - Required <br/> - `String` type <br/> - Min length is 6 type | Recommend:`encryption` |
| `dateOfBirth` | - Optional <br/> - `String` type                              |                        |
| `gender`      | - Optional <br/> - `String` type                              |                        |
| `phoneNumber` | - Optional <br/> - `String` type                              |                        |

### Successful Response Example

```
{
    "results": {
        "userName": "thanhnv",
        "email": "thanhnv.dev.personal@gmail.com",
        "dateOfBirth": null,
        "gender": null,
        "phoneNumber": null,
        "isVerifiedEmail": false,
        "id": "6527692852f037a982e685ed",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5NzA4MTY0MCwiZXhwIjoxNjk3MDkyNDQwfQ.iEJr44O8Clx1uweSrZtsin9kVcMGh1DgqNlQSwGbX6Y",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5NzA4MTY0MCwiZXhwIjoxNjk3OTQ1NjQwfQ.TJo7ekNoT58j3SpwiI0XrtGxJnZyZXAq6bZ9T4RA3Ao"
    },
    "msg": "Sign Up Success!"
}
```

### Error Response Examples

- **`Email registered`**
  ```
  {
    "msg": "Email was registered!"
  }
  ```
- **`Field required / field type incorrect`**
  ```
  {
    "msg": "\"email\" is required"
  }
  ```
  ```
  {
    "msg": "\"email\" must be a valid email"
  }
  ```

# Sign In

> Login

### End Point

```
user/sign-in
```

### Method

**`POST`**

### Parameters

| Field Name | Requirements                                                  | Note                   |
| :--------- | :------------------------------------------------------------ | ---------------------- |
| `userName` | - Required <br/> - `String` type <br/> - Min length is 3 type |                        |
| `email`    | - Required <br/> - `Email` type                               |                        |
| `password` | - Required <br/> - `String` type <br/> - Min length is 6 type | Recommend:`encryption` |

### Successful Response Example

```
{
    "results": {
        "userName": "thanhnv",
        "email": "thanhnv.dev.personal@gmail.com",
        "password": "123456",
        "dateOfBirth": null,
        "gender": null,
        "phoneNumber": null,
        "isVerifiedEmail": false,
        "id": "6527692852f037a982e685ed",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5NzA4MjMyMywiZXhwIjoxNjk3MDkzMTIzfQ.qyJVM4eJZL4Oj2hB-_qOgSfqhbnsXNaYww5SSL6XF3Q",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5NzA4MjMyMywiZXhwIjoxNjk3OTQ2MzIzfQ.xwEYI8_BEovNcXdopT-ir9qmYFoXFO1AFfSK_bv5J4Q"
    },
    "msg": "Sign In Successfully!"
}
```

### Error Response Examples

- **`Incorrect account information`**
  ```
  {
    "msg": "Account information is incorrect!"
  }
  ```
- **`Field required / field type incorrect`**
  ```
  {
      "msg": "email field is required"
  }
  ```
  ```
  {
    "msg": "\"password\" is required"
  }
  ```
  ```
  {
    "msg": "\"email\" must be a valid email"
  }
  ```

# Profile

> Get ueser profile

### End Point

```
user/profile
```

### Method

**`GET`**

### Bearer token required

### Query parameter

| Field Name | Requirements                     | Note |
| :--------- | :------------------------------- | ---- |
| `id`       | - Required <br/> - `String` type |      |

### Successful Response Example

```
{
    "results": {
        "userName": "thanhnv",
        "email": "thanhnv.dev.personal@gmail.com",
        "password": "123456",
        "dateOfBirth": null,
        "gender": null,
        "phoneNumber": null,
        "isVerifiedEmail": false,
        "id": "6527692852f037a982e685ed",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5NzA4NDU4NCwiZXhwIjoxNjk3MDk1Mzg0fQ.QgfMEhk5pz7PnimzVEVxYR6x-IqLG-nR83AEF78cbhw",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5NzA4NDU4NCwiZXhwIjoxNjk3OTQ4NTg0fQ.PmzB-oA7FEUWhRdhQiIYtoLxgCMbOgN2zdvEZtYzec0"
    },
    "msg": "Get profile Successfully!"
}
```

### Error Response Examples

- **`Field required / field type incorrect`**
  ```
  {
    "msg": "\"id\" is not allowed to be empty"
  }
  ```
  ```
  {
    "msg": "User does not exist!"
  }
  ```

# Refresh Token

### End Point

```
user/refresh-token
```

### Method

**`POST`**

### Query parameter

| Field Name     | Requirements                     | Note |
| :------------- | :------------------------------- | ---- |
| `refreshToken` | - Required <br/> - `String` type |      |

### Successful Response Example

```
{
    "results": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxiV0ZwYkNJNkluUm9ZVzVvYm5ZdVpHVjJMbkJsY25OdmJtRnNRR2R0WVdsc0xtTnZiU0lzSW1saGRDSTZNVFk1TnpBek1qZzNOQ3dpWlhod0lqb3hOamszT0RrMk9EYzBmUS56cWQydm01UnU4bGlXQkxFQllJcHlnVG5TWm9iZUhnVjFzZE94dWlNSzNJIiwiaWF0IjoxNjk3MDg0ODQ5LCJleHAiOjE2OTcwOTU2NDl9.O0JOu9IK9ZV5orqU6dnj-qLZgcTNTU36464rF9oT8NQ",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxiV0ZwYkNJNkluUm9ZVzVvYm5ZdVpHVjJMbkJsY25OdmJtRnNRR2R0WVdsc0xtTnZiU0lzSW1saGRDSTZNVFk1TnpBek1qZzNOQ3dpWlhod0lqb3hOamszT0RrMk9EYzBmUS56cWQydm01UnU4bGlXQkxFQllJcHlnVG5TWm9iZUhnVjFzZE94dWlNSzNJIiwiaWF0IjoxNjk3MDg0ODQ5LCJleHAiOjE2OTc5NDg4NDl9.N_4nNeaRIfPnF-c90gxxQIn07x9PlSNSPqQU6emaFAU"
    },
    "msg": "Refresh token Successfully!"
}
```

### Error Response Example

```
{
    "msg": "Forbidden"
}
```

# Custom Token

> Create a custom token

### End Point

```
user/custom-token
```

### Method

**`POST`**

### Query parameter

| Field Name  | Requirements                                                                                                           | Note                                                                  |
| :---------- | :--------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `expiresIn` | - Required <br/> - `String` type <br/> - Starting with a number and ending with the following letters s or m or h or d | - s is seconds <br/> - m is minute <br/> - h is hour <br/> - d is day |

### Successful Response Example

```
{
    "results": {
        "customToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiY3VzdG9tIHRva2VuIiwiaWF0IjoxNjk3MDg1MTEwLCJleHAiOjE2OTcwODUxMzB9.mM8qquoYJzDEZrUeWISJx7IAK_aFgGqZOQ7UJp8ICqo"
    },
    "msg": "Create custom token Successfully!"
}
```

### Error Response Example

```
{
    "msg": "expiresIn field must be a string starting with a number and ending with the following letters s or m or h or d. s is seconds. m is minute. h is hour . d is day"
}
```

# Delete

> Delete user account

### End Point

```
user/delete
```

### Method

**`POST`**

### Bearer token required

### Query parameter

| Field Name | Requirements                                                  | Note                   |
| :--------- | :------------------------------------------------------------ | ---------------------- |
| `email`    | - Required <br/> - `Email` type                               |                        |
| `password` | - Required <br/> - `String` type <br/> - Min length is 6 type | Recommend:`encryption` |

### Successful Response Example

```
{
    "msg": "Account deleted successfully!"
}
```

### Error Response Example

```
{
    "msg": "Account information is incorrect!"
}
```

```
{
    "msg": "\"password\" length must be at least 6 characters long"
}
```

# Send Verification Code

### End Point

```
mail/send-verification-code
```

### Method

**`POST`**

### Query parameter

| Field Name | Requirements                    | Note |
| :--------- | :------------------------------ | ---- |
| `email`    | - Required <br/> - `Email` type |      |

### Successful Response Example

```
{
    "msg": "Email sent successfully!"
}
```

### Error Response Examples

```
{
    "msg": "Email sent successfully!"
}
```

```
{
    "msg": "This email has been verified!"
}
```

```
{
    "msg": "\"email\" must be a valid email"
}
```

# Verify Code

### End Point

```
mail/verify-code
```

### Method

**`POST`**

### Query parameter

| Field Name | Requirements                     | Note |
| :--------- | :------------------------------- | ---- |
| `code`     | - Required <br/> - `Number` type |      |

### Successful Response Example

```
{
    "msg": "Verified successfully!"
}
```

### Error Response Examples

```
{
    "msg": "The verification code is incorrect or has expired!"
}
```
