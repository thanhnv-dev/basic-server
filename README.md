# Basic server


# Contents

- [Notes](#notes)
- [Api List](#api_list)
- [Base URL](#base-url)
- [Postman collection](https://github.com/thanhnv-dev/basic-server/blob/main/postman_collection.json)
- [Change log](https://github.com/thanhnv-dev/basic-server/blob/main/change_log.md)

# Notes

### Api `send-verification-code` and `verify-code`

| Case                                                                                                                                                   | Note                                                                                                              |
| :----------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| - The email sent to the `send-verification-code` api has been `sign-up`<br/> - Never `verify-code` or field `isVerifiedEmail` in user data is `false`  | - When verification is successful(`verify-code`), field `isVerifiedEmail` in user data will be changed to `true`. |
| - The email sent to the `send-verification-code` api has been `sign-up`<br/> - Already `verify-code` or field `isVerifiedEmail` in user data is `true` | - Sending the request will fail because the email has already been verified.                                      |
| - The email sent to the `send-verification-code` api has not been `sign-up`                                                                            | - Sending the request will fail because the email needs to be `sign-up`                                           |

### Status codes

| Case               | Status code | Note         |
| :----------------- | :---------- | :----------- |
| Susccess           | 200         |              |
| Failed             | 400         |              |
| Tokens expire      | 401         | Unauthorized |
| Token is incorrect | 403         | Forbidden    |

# Api List

- [Sign Up](#sign-up)
- [Sign In](#sign-in)
- [Profile](#profile)
- [Refresh Token](#refresh-token)
- [Custom Token](#custom-token)
- [Delete](#delete)
- [Send Verification Code](#send-verification-code)
- [Verify code](#verify-code)
- [Categories](#categories)
- [Restaurants](#restaurants)
- [Restaurant](#restaurant)
- [Dish](#dish)

# Base URL

```
https://common-api-v1.vercel.app
```

# Sign Up

> Use to create new account

### End Point

`user/sign-up`

### Method

**`POST`**

### Parameters

| Field Name      | Requirements                                                  | Note                   |
| :-------------- | :------------------------------------------------------------ | :--------------------- |
| `user_name`     | - Required <br/> - `String` type <br/> - Min length is 3 type |                        |
| `email`         | - Required <br/> - `Email` type                               |                        |
| `password`      | - Required <br/> - `String` type <br/> - Min length is 6 type | Recommend:`encryption` |
| `date_of_birth` | - Optional <br/> - `String` type                              |                        |
| `gender`        | - Optional <br/> - `String` type                              |                        |
| `phone_number`  | - Optional <br/> - `String` type                              |                        |

### Response data type

| Field Name          | Type      | Note              |
| ------------------- | :-------- | :---------------- |
| `results`           | `Object`  |                   |
| `_id`               | `String`  | Child of `result` |
| `user_name`         | `String`  | Child of `result` |
| `email`             | `String`  | Child of `result` |
| `date_of_birth`     | `String?` | Child of `result` |
| `gender`            | `String?` | Child of `result` |
| `phone_number`      | `String?` | Child of `result` |
| `is_verified_email` | `Boolean` | Child of `result` |
| `token`             | `String`  | Child of `result` |
| `refresh_token`     | `String`  | Child of `result` |
| `msg`               | `String`  |                   |

### Successful Response Example

```
{
    "results": {
        "user_name": "thanhnv",
        "email": "thanhnv.dev.personal@gmail.com",
        "date_of_birth": null,
        "gender": null,
        "phone_number": null,
        "is_verified_email": false,
        "_id": "65445c7cbc09a859e33a5c19",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5ODk3ODk0MCwiZXhwIjoxNjk4OTg5NzQwfQ.v3eecfRpOQIkGblzzd1RTvGkhi-YVNzpim9M17u17n8",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5ODk3ODk0MCwiZXhwIjoxNjk5ODQyOTQwfQ.JmHF0GDNAFup8nRb3aYLFVZGlihglu_tU7f7ionKGsE"
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

| Field Name  | Requirements                                                  | Note                   |
| :---------- | :------------------------------------------------------------ | ---------------------- |
| `user_name` | - Required <br/> - `String` type <br/> - Min length is 3 type |                        |
| `email`     | - Required <br/> - `Email` type                               |                        |
| `password`  | - Required <br/> - `String` type <br/> - Min length is 6 type | Recommend:`encryption` |

### Response data type

| Field Name          | Type      | Note              |
| ------------------- | :-------- | :---------------- |
| `results`           | `Object`  |                   |
| `_id`               | `String`  | Child of `result` |
| `user_name`         | `String`  | Child of `result` |
| `email`             | `String`  | Child of `result` |
| `date_of_birth`     | `String?` | Child of `result` |
| `gender`            | `String?` | Child of `result` |
| `phone_number`      | `String?` | Child of `result` |
| `is_verified_email` | `Boolean` | Child of `result` |
| `token`             | `String`  | Child of `result` |
| `refresh_token`     | `String`  | Child of `result` |
| `msg`               | `String`  |                   |

### Successful Response Example

```
{
    "results": {
        "user_name": "thanhnv",
        "email": "thanhnv.dev.personal@gmail.com",
        "date_of_birth": null,
        "gender": null,
        "phone_number": null,
        "is_verified_email": false,
        "_id": "65445c7cbc09a859e33a5c19",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5ODk4MTU4MCwiZXhwIjoxNjk4OTkyMzgwfQ.LvwbGus82Gqtg44Av1ADCorGKA_-JwNixpCrv8UWRK0",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5ODk4MTU4MCwiZXhwIjoxNjk5ODQ1NTgwfQ.MhKo5AmLpDY6dZrsUEV_KmPnWgGNbrzIfWU6MaEHE2E"
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

### Response data type

| Field Name          | Type      | Note              |
| ------------------- | :-------- | :---------------- |
| `results`           | `Object`  |                   |
| `_id`               | `String`  | Child of `result` |
| `user_name`         | `String`  | Child of `result` |
| `email`             | `String`  | Child of `result` |
| `date_of_birth`     | `String?` | Child of `result` |
| `gender`            | `String?` | Child of `result` |
| `phone_number`      | `String?` | Child of `result` |
| `is_verified_email` | `Boolean` | Child of `result` |
| `token`             | `String`  | Child of `result` |
| `refresh_token`     | `String`  | Child of `result` |
| `msg`               | `String`  |                   |

### Successful Response Example

```
{
    "results": {
        "user_name": "thanhnv",
        "email": "thanhnv.dev.personal@gmail.com",
        "date_of_birth": null,
        "gender": null,
        "phone_number": null,
        "is_verified_email": false,
        "_id": "65445c7cbc09a859e33a5c19",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5ODk4MzgwOCwiZXhwIjoxNjk4OTk0NjA4fQ.9ySZHU2yooKoPedctAWwIXJ4a_AKqvGJFtPvGCKmbig",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoYW5obnYuZGV2LnBlcnNvbmFsQGdtYWlsLmNvbSIsImlhdCI6MTY5ODk4MzgwOCwiZXhwIjoxNjk5ODQ3ODA4fQ.l5KbV24as5qGiIAN4YGq702kK1ltc9m-VcG6aP_w2X4"
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

| Field Name      | Requirements                     | Note |
| :-------------- | :------------------------------- | ---- |
| `refresh_token` | - Required <br/> - `String` type |      |

### Response data type

| Field Name      | Type     | Note              |
| --------------- | :------- | :---------------- |
| `results`       | `Object` |                   |
| `token`         | `String` | Child of `result` |
| `refresh_token` | `String` | Child of `result` |
| `msg`           | `String` |                   |

### Successful Response Example

```
{
    "results": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxiV0ZwYkNJNkluUm9ZVzVvYm5ZdVpHVjJMbkJsY25OdmJtRnNRR2R0WVdsc0xtTnZiU0lzSW1saGRDSTZNVFk1TnpBek1qZzNOQ3dpWlhod0lqb3hOamszT0RrMk9EYzBmUS56cWQydm01UnU4bGlXQkxFQllJcHlnVG5TWm9iZUhnVjFzZE94dWlNSzNJIiwiaWF0IjoxNjk3MDg0ODQ5LCJleHAiOjE2OTcwOTU2NDl9.O0JOu9IK9ZV5orqU6dnj-qLZgcTNTU36464rF9oT8NQ",
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxiV0ZwYkNJNkluUm9ZVzVvYm5ZdVpHVjJMbkJsY25OdmJtRnNRR2R0WVdsc0xtTnZiU0lzSW1saGRDSTZNVFk1TnpBek1qZzNOQ3dpWlhod0lqb3hOamszT0RrMk9EYzBmUS56cWQydm01UnU4bGlXQkxFQllJcHlnVG5TWm9iZUhnVjFzZE94dWlNSzNJIiwiaWF0IjoxNjk3MDg0ODQ5LCJleHAiOjE2OTc5NDg4NDl9.N_4nNeaRIfPnF-c90gxxQIn07x9PlSNSPqQU6emaFAU"
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

| Field Name   | Requirements                                                                                                           | Note                                                                  |
| :----------- | :--------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `expires_in` | - Required <br/> - `String` type <br/> - Starting with a number and ending with the following letters s or m or h or d | - s is seconds <br/> - m is minute <br/> - h is hour <br/> - d is day |

### Response data type

| Field Name     | Type     | Note              |
| -------------- | :------- | :---------------- |
| `results`      | `Object` |                   |
| `custom_token` | `String` | Child of `result` |
| `msg`          | `String` |                   |

### Successful Response Example

```
{
    "results": {
        "custom_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiY3VzdG9tIHRva2VuIiwiaWF0IjoxNjk3MDg1MTEwLCJleHAiOjE2OTcwODUxMzB9.mM8qquoYJzDEZrUeWISJx7IAK_aFgGqZOQ7UJp8ICqo"
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

**`DELETE`**

### Bearer token required

### Query parameter

| Field Name | Requirements                     | Note |
| :--------- | :------------------------------- | ---- |
| `id`       | - Required <br/> - `String` type |      |

### Response data type

| Field Name | Type     | Note |
| ---------- | :------- | :--- |
| `msg`      | `String` |      |

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

> Send an email containing the verification code to the email associated with the user

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

### Response data type

| Field Name | Type     | Note |
| ---------- | :------- | :--- |
| `msg`      | `String` |      |

### Successful Response Example

```
{
    "msg": "Email sent successfully!"
}
```

### Error Response Examples

```
{
    "msg": "This email is not yet associated with a user."
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

> Verify users with verification code

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

### Response data type

| Field Name | Type     | Note |
| ---------- | :------- | :--- |
| `msg`      | `String` |      |

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

# Categories

> Get data categories

### End Point

```
app/categories
```

### Method

**`GET`**

### Bearer token required

### Response data type

| Field Name      | Type     | Note              |
| --------------- | :------- | :---------------- |
| `results`       | `Array`  |                   |
| `_id`           | `String` | Child of `result` |
| `category_name` | `String` | Child of `result` |
| `image_url`     | `String` | Child of `result` |
| `msg`           | `String` |                   |

### Successful Response Example

```
{
    "msg": "Get categories successfully!",
    "result": [
        {
            "_id": "6541da16f015a8f58288420b",
            "category_name": "Donat",
            "image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/category%2Fdonat.png?alt=media&token=0b7cb09c-7185-4cc7-b1b4-f9074e845e23&_gl=1*g72zi8*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODgxMDY4MS40MC4xLjE2OTg4MTA5NzAuNjAuMC4w"
        },
        {
            "_id": "6541da2f19041491f445f862",
            "category_name": "Hot Dog",
            "image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/category%2Fhotdog.png?alt=media&token=ec7f5873-5ceb-4e94-9db2-4b03e281c30b&_gl=1*5cam9u*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODgxMDY4MS40MC4xLjE2OTg4MTEwNjQuNjAuMC4w"
        }
    ]
}
```

### Error Response Examples

- **`Unauthorized`**
  ```
  {
    msg: 'Unauthorized'
  }
  ```

# Restaurants

> Get data of many restaurants

### End Point

```
app/restaurants
```

### Method

**`GET`**

### Bearer token required

### Response data type

| Field Name             | Type      | Note                           |
| ---------------------- | :-------- | :----------------------------- |
| `results`              | `Array`   |                                |
| `msg`                  | `String`  |                                |
| `_id`                  | `String`  | Child of `result`              |
| `restaurant_name`      | `String`  | Child of `result`              |
| `review_count`         | `Number`  | Child of `result`              |
| `review_star`          | `String`  | Child of `result`              |
| `tags`                 | `JSON`    | Child of `result`              |
| `deliveryDescription`  | `Object`  | Child of `result`              |
| `delivery_fee`         | `String`  | Child of `deliveryDescription` |
| `delivery_time`        | `String`  | Child of `deliveryDescription` |
| `verify`               | `Boolean` | Child of `result`              |
| `background_image_url` | `String`  | Child of `result`              |
| `restaurant_image_url` | `String`  | Child of `result`              |

### Successful Response Example

```
{
    "msg": "Get restaurants successfully!",
    "result": [
        {
            "_id": "6543711a67951e9e9c2a312a",
            "restaurant_name": "Restaurant 1",
            "review_count": 50,
            "review_star": 4.3,
            "tags": "[\"BURGER\", \"CHICKET\", \"FAST FOOD\"]",
            "deliveryDescription": {
                "delivery_fee": "true",
                "delivery_time": "10-15 mins"
            },
            "verify": true,
            "background_image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/food%2Ffood1.png?alt=media&token=77e7dc5f-1d65-4d48-b215-ca3b46697672&_gl=1*1hblm6*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODkwNTk5OS40Mi4xLjE2OTg5MDYxMTQuNi4wLjA.",
            "restaurant_image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/restaurant_avt%2Fr_avt1.png?alt=media&token=2c4cd6dc-2058-471c-ba4a-c4e55c10c785&_gl=1*s50xp6*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODkwNTk5OS40Mi4xLjE2OTg5MDYzNDEuNTEuMC4w"
        }
    ]
}
```

### Error Response Examples

- **`Unauthorized`**
  ```
  {
    msg: 'Unauthorized'
  }
  ```

# Restaurant

> Get data of a restaurant

### End Point

```
app/restaurant
```

### Method

**`GET`**

### Bearer token required

### Query parameter

| Field Name | Requirements                     | Note |
| :--------- | :------------------------------- | ---- |
| `id`       | - Required <br/> - `String` type |      |

### Response data type

| Field Name             | Type      | Note                           |
| ---------------------- | :-------- | :----------------------------- |
| `results`              | `Object`  |                                |
| `msg`                  | `String`  |                                |
| `_id`                  | `String`  | Child of `result`              |
| `restaurant_name`      | `String`  | Child of `result`              |
| `review_count`         | `Number`  | Child of `result`              |
| `review_star`          | `Number`  | Child of `result`              |
| `tags`                 | `JSON`    | Child of `result`              |
| `deliveryDescription`  | `Object`  | Child of `result`              |
| `delivery_fee`         | `String`  | Child of `deliveryDescription` |
| `delivery_time`        | `String`  | Child of `deliveryDescription` |
| `verify`               | `Boolean` | Child of `result`              |
| `background_image_url` | `String`  | Child of `result`              |
| `restaurant_image_url` | `String`  | Child of `result`              |
| `dishs`                | `Array`   | Child of `result`              |
| `_id`                  | `String`  | Child of `dishs`               |
| `dish_name`            | `String`  | Child of `dishs`               |
| `image_url`            | `String`  | Child of `dishs`               |
| `review_count`         | `Number`  | Child of `dishs`               |
| `review_star`          | `Number`  | Child of `dishs`               |
| `price`                | `Number`  | Child of `dishs`               |

### Successful Response Example

```
{
    "msg": "Get restaurant successfully!",
    "result": {
        "_id": "6543711a67951e9e9c2a312a",
        "restaurant_name": "Restaurant 1",
        "review_count": 50,
        "review_star": 4.3,
        "tags": "[\"BURGER\", \"CHICKET\", \"FAST FOOD\"]",
        "deliveryDescription": {
            "delivery_fee": "true",
            "delivery_time": "10-15 mins"
        },
        "verify": true,
        "background_image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/food%2Ffood1.png?alt=media&token=77e7dc5f-1d65-4d48-b215-ca3b46697672&_gl=1*1hblm6*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODkwNTk5OS40Mi4xLjE2OTg5MDYxMTQuNi4wLjA.",
        "restaurant_image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/restaurant_avt%2Fr_avt1.png?alt=media&token=2c4cd6dc-2058-471c-ba4a-c4e55c10c785&_gl=1*s50xp6*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODkwNTk5OS40Mi4xLjE2OTg5MDYzNDEuNTEuMC4w",
        "dishs": [
            {
                "_id": "6541d0b362c8dd3b531d9a6b",
                "dish_name": "Ground Beef Tacos",
                "image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/food%2Ffood1.png?alt=media&token=77e7dc5f-1d65-4d48-b215-ca3b46697672&_gl=1*1dmf3w8*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODgxMDY4MS40MC4xLjE2OTg4MTE2MjUuNDcuMC4w",
                "price": 9.5,
                "review_count": 30,
                "review_star": 4.5
            },
            {
                "_id": "6541d2c9c9fc42e859e471fe",
                "dish_name": "Pizza 1",
                "image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/food%2Ffood2.png?alt=media&token=d1eac735-0061-4fa8-8906-bb4c6778a411&_gl=1*1qpqex8*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODgxMDY4MS40MC4xLjE2OTg4MTIyNTcuNTQuMC4w",
                "price": 10.35,
                "review_count": 25,
                "review_star": 4.5
            }
        ]
    }
}
```

### Error Response Examples

- **`Field required / Unauthorized`**
  ```
  {
    "msg": "\"id\" is not allowed to be empty"
  }
  ```
  ```
  {
    msg: 'Unauthorized'
  }
  ```

# Dish

> Get data dish

### End Point

```
app/dish
```

### Method

**`GET`**

### Bearer token required

### Query parameter

| Field Name | Requirements                     | Note |
| :--------- | :------------------------------- | ---- |
| `id`       | - Required <br/> - `String` type |      |

### Response data type

| Field Name     | Type     | Note                |
| -------------- | :------- | :------------------ |
| `results`      | `Object` |                     |
| `_id`          | `String` | Child of `result`   |
| `parent_id`    | `String` | Child of `result`   |
| `dish_name`    | `String` | Child of `result`   |
| `image_url`    | `String` | Child of `result`   |
| `description`  | `String` | Child of `result`   |
| `price`        | `Number` | Child of `result`   |
| `review_count` | `Number` | Child of `result`   |
| `review_star`  | `Number` | Child of `result`   |
| `toppings`     | `Array`  | Child of `result`   |
| `_id`          | `String` | Child of `toppings` |
| `topping_name` | `String` | Child of `toppings` |
| `price`        | `Number` | Child of `toppings` |
| `image_url`    | `String` | Child of `toppings` |

### Successful Response Example

```
{
    "msg": "Get restaurant successfully!",
    "result": {
        "_id": "6541d0b362c8dd3b531d9a6b",
        "parent_id": "6543711a67951e9e9c2a312a",
        "dish_name": "Ground Beef Tacos",
        "image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/food%2Ffood1.png?alt=media&token=77e7dc5f-1d65-4d48-b215-ca3b46697672&_gl=1*1dmf3w8*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODgxMDY4MS40MC4xLjE2OTg4MTE2MjUuNDcuMC4w",
        "description": "Brown the beef better. Lean ground beef - I like to use 85% lean angus. Garlic - use fresh  chopped. Spices - chili powder, cumin, onion powder.",
        "price": 9.5,
        "review_count": 30,
        "review_star": 4.5,
        "toppings": [
            {
                "_id": "1",
                "topping_name": "Pepper Julienned",
                "price": 2.3,
                "image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/topping%2Ftopping3.png?alt=media&token=c2667ef9-d955-4db4-9e73-9b00c477a1c9&_gl=1*3n5hyw*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODgxMDY4MS40MC4xLjE2OTg4MTE4MjIuMTAuMC4w"
            },
            {
                "_id": "2",
                "topping_name": "Baby Spinach",
                "price": 4.7,
                "image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/topping%2Ftopping2.png?alt=media&token=ee8b44b5-0abd-4bb5-a032-b26eac185855&_gl=1*n50esp*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODgxMDY4MS40MC4xLjE2OTg4MTE3ODIuNTAuMC4w"
            },
            {
                "_id": "3",
                "topping_name": "Masroom",
                "price": 4.7,
                "image_url": "https://firebasestorage.googleapis.com/v0/b/basic-server-31577.appspot.com/o/topping%2Ftopping1.png?alt=media&token=38941a24-4ce6-48ab-8e82-99d545bd0841&_gl=1*1ux5d5d*_ga*NTY5NDM2ODgzLjE2OTE2NTAxMzI.*_ga_CW55HF8NVT*MTY5ODgxMDY4MS40MC4xLjE2OTg4MTE4NDIuNTguMC4w"
            }
        ]
    }
}
```

### Error Response Examples

- **`Field required / Unauthorized`**
  ```
  {
    "msg": "\"id\" is not allowed to be empty"
  }
  ```
  ```
  {
    msg: 'Unauthorized'
  }
  ```
