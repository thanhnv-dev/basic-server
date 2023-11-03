# Basic service v2 update

## 11/03/2023

1. Change the variable name format from **`lowerCamelCase`** to **`Snake_case`**.
2. Change api **`user/delete`** method from **`POST`** to **`DELETE`**, Remove **`email`** **`password`** requirement in **`Parameters`**, switch to requiring **`id`** in **`Query parameter`**
3. The **`mail/send-verification-code`** api will force an email association with the user to be able to send emails.
4. Add some new api
   - **`food-hub/categories`**
   - **`food-hub/restaurants`**
   - **`food-hub/restaurant`**
   - **`food-hub/dish`**
5. API **`food-hub/restaurants`** and **`food-hub/restaurant`** Returns mixed data types and mixed variable name format from
6. Update [Postman collection](https://github.com/thanhnv-dev/basic-server/blob/main/postman_collection.json)

**Read more at [README](https://github.com/thanhnv-dev/basic-server/blob/main/README.md)**
