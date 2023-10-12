# Basic server

## Contents

- [Base URL](#-base-url)
- [Sign Up](#sign-up)
- [Sign In](#sign-in)
- [Profile](#profile)
- [Refresh Token](#refresh-token)
- [Custom Token](#custom-token)
- [Delete](#delete)
- [Send Verification Code](#send-verification-code)
- [Verify code](#verify-code)

# Base URL

```
https://common-api-v1.vercel.app/
```

# Sign Up

> Use to create new account

### End Point

```
user/sign-up
```

### Method

**`POST`**

### Parameter

- **`userName`**

  Requirements:

  - Required
  - `String` type
  - Min length is 3

- **`email`**

  Requirements:

  - Required
  - `Email` type

- **`password`**

  Requirements:

  - Required
  - `String` type
  - Min length is 6

  Recommend: `encryption`

- **`dateOfBirth`**

  Requirements:

  - Optional
  - `String` type

- **`gender`**

  Requirements:

  - Optional
  - `String` type

- **`phoneNumber`**

  Requirements:

  - Optional
  - `String` type

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

### End Point

```
user/sign-in
```

### Method

**`POST`**

### Parameter

- **`userName`**

  Requirements:

  - Required
  - `String` type
  - Min length is 3

- **`email`**

  Requirements:

  - Required
  - `Email` type

- **`password`**

  Requirements:

  - Required
  - `String` type
  - Min length is 6

  Recommend: `encryption`

### Successful Response

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

### Error Response

- **`Incorrect account information`**
  ```
  {
    "msg": "Account information is incorrect!"
  }
  ```
- **`Field required \ field type incorrect`**
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
