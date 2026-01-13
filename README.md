# 🌍 Tourism Together - Backend

Server Backend cho ứng dụng Web Tourism Together - Nền tảng quản lý du lịch hiện đại.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://server-backend-tourism.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Documentation](#api-documentation)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Đóng góp](#đóng-góp)
- [License](#license)

## 🎯 Giới thiệu

Tourism Together Backend là server-side application được xây dựng để hỗ trợ nền tảng quản lý du lịch, cung cấp các API RESTful cho việc quản lý tour, booking, người dùng và các tính năng liên quan đến du lịch.

**Live Demo**: [https://server-backend-tourism.vercel.app](https://server-backend-tourism.vercel.app)

## 🛠 Công nghệ sử dụng

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (với TypeORM)
- **Deployment**: Vercel
- **Authentication**: JWT (JSON Web Tokens)

## 📦 Cài đặt

### Yêu cầu hệ thống

- Node.js >= 16.x
- npm hoặc yarn
- PostgreSQL >= 13.x

### Các bước cài đặt

1. Clone repository:
```bash
git clone https://github.com/TourismTogether/backend.git
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

## ⚙️ Cấu hình

Tạo file `.env` trong thư mục root với các biến môi trường sau:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=tourism_together

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Other Configurations
API_VERSION=v1
```

## 🚀 Chạy ứng dụng

### Development mode

```bash
npm run dev
# hoặc
yarn dev
```

Server sẽ chạy tại: `http://localhost:3000`

### Production build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Available Scripts

```bash
npm run dev         # Chạy development server với hot reload
npm run build       # Build TypeScript files
npm start           # Chạy production server
npm run lint        # Kiểm tra code style với ESLint
npm test            # Chạy tests
```

## 📚 API Documentation

Chi tiết về các API endpoints có thể xem tại file [API-documentation.md](./API-documentation.md)

### Base URL

```
Development: http://localhost:3000/api/v1
Production: https://server-backend-tourism.vercel.app/api/v1
```

### Các API chính

- **Authentication**
  - `POST /auth/register` - Đăng ký tài khoản
  - `POST /auth/login` - Đăng nhập
  - `POST /auth/logout` - Đăng xuất

- **Tours**
  - `GET /tours` - Lấy danh sách tours
  - `GET /tours/:id` - Lấy chi tiết tour
  - `POST /tours` - Tạo tour mới
  - `PUT /tours/:id` - Cập nhật tour
  - `DELETE /tours/:id` - Xóa tour

- **Bookings**
  - `GET /bookings` - Lấy danh sách bookings
  - `POST /bookings` - Tạo booking mới
  - `GET /bookings/:id` - Lấy chi tiết booking

- **Users**
  - `GET /users/profile` - Lấy thông tin profile
  - `PUT /users/profile` - Cập nhật profile

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/           # Cấu hình database, jwt, etc.
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models (TypeORM entities)
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── index.ts          # Application entry point
├── .gitignore
├── package.json
├── tsconfig.json
├── API-documentation.md
└── README.md
```

### Coding Standards

- Sử dụng TypeScript cho tất cả code mới
- Follow ESLint configuration
- Viết tests cho các tính năng mới
- Cập nhật documentation khi cần thiết

## 🔒 Security

Nếu phát hiện lỗ hổng bảo mật, vui lòng liên hệ trực tiếp với team thay vì tạo public issue.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Team TourismTogether
- Tất cả contributors đã đóng góp cho dự án

---

Made with ❤️ by [TourismTogether Team](https://github.com/TourismTogether)
