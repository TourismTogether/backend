
# API Documentation

**API Response:**
```json
{
  "status": "number",
  "message": "string",
  "data": "any",
  "error": "boolean"
}
```

**Error code:**
```
    200 - ✅ Request thành công
    400 - ❌ Dữ liệu không hợp lệ
    404 - ❌ Không tìm thấy resource
    409 - ❌ Mâu thuẫn dữ liệu
    500 - ❌ Lỗi server nội bộ
```

## User

### GET /users
Lấy danh sách tất cả user

### GET /users/:id
Lấy thông tin chi tiết 1 user theo `id`

### GET /users/:id/trips
Lấy danh sách chuyến đi của user

### POST /users
Tạo mới user   
Request body:
``` json
{
    "account_id": "",
    "full_name": "",
    "avatar_url": "",
    "phone": "",
}
```
### PATCH /users/:id
Cập nhật thông tin user theo `id`  
Request body:
``` json
{
    "account_id": "",
    "full_name": "", // ?
    "avatar_url": "", // ?
    "phone": "", // ?
}
```
### DELETE /users/:id
Xóa user theo `id`

## Auth
### POST /signin
Đăng nhập  
Request body:
``` json
{
    "username": "", // ?
    "email": "", // ?
    "password": ""
}
```

### POST /signup
Đăng ký
Request body:
``` json
{
    "username": "", 
    "email": "", 
    "password": "", 
    "full_name": "", 
    "avatar_url": "", // ?
    "phone": "" // ?
}
```

## Account
### GET /accounts
Lấy tất cả accounts

### POST /accounts
Tạo 1 account  
Request body:
``` json
{
    "username": "",
    "password": "",
    "email": ""
}
```

### PATCH /accounts/:id
chỉnh sửa 1 account  
Request body:
``` json
{
    "username": "",
    "password": "",
    "email": ""
}
```

### DELETE /accounts/:id

## Admin

### GET /admins
Lấy tất cả admins

### POST /admins
Tạo 1 admin  
Request body:
``` json
{
    "user_id": "",
    "key": "",
}
```

### PATCH /admins/:user_id
Sửa 1 admin  
Request body:
``` json
{
    "user_id": "",
    "key": "",
}
```

### DELETE /admins/:user_id
Xóa 1 admin

## COST

### GET /costs
Lấy tất cả cost

### GET /costs/:id
Lấy cost theo id

### POST /costs
Tạo 1 cost  
Request body:
``` json
{
    "route_id": "",
    "title": "",
    "description": "",
    "category": "", 
    "cost": 0
}
```

### PATCH /costs/:id
Sửa 1 cost

### DELETE /costs/:id
Xóa 1 cost

## Destination

### GET /destinations
Lấy tất cả destinations

### GET /destinations/:id
Lấy destination theo id

### POST /destiantions
Tạo 1 destination  
Request body:
``` json
{
    "region_id": "",
    "name": "",
    "country": "",
    "description": "",
    "latitude": 0,
    "longitude": 0,
    "category": "",
    "best_season": "",
    "rating": 0,
    "images": [""]
}
```

### PATCH /destinations/:id
Sửa 1 destination  
Request body:
``` json
{
    "region_id": "",
    "name": "",
    "country": "",
    "description": "",
    "latitude": 0,
    "longitude": 0,
    "category": "",
    "best_season": "",
    "rating": 0,
    "images": [""]
}
```

### DELETE /destinations/:id
Xóa 1 destination

