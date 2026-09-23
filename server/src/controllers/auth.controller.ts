// // src/controllers/auth.controller.ts

// import { createError } from "@/errors/app-error";
// import { Request, Response } from "express";
// import {
//   changePassword,
//   getProfile,
//   loginUser,
//   registerUser,
//   updateProfile,
// } from "../services/auth.service";
// import { asyncHandler } from "../utils/asyncHandler";

// // ============================================================
// // 📝 تسجيل مستخدم جديد (Sign Up)
// // ============================================================
// export const signUp = asyncHandler(async (req: Request, res: Response) => {
//   const { name, email, password } = req.body;

//   const { user, token } = await registerUser(name, email, password);

//   res.status(201).json({
//     success: true,
//     message: "User created successfully",
//     data: { token, user },
//   });
// });

// // ============================================================
// // 🔐 تسجيل الدخول (Sign In)
// // ============================================================
// export const signIn = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   console.log("email", email);

//   const { user, token } = await loginUser(email, password);
//   console.log("token2222222", token);

//   res.status(200).json({
//     success: true,
//     message: "Logged in successfully",
//     data: { token, user },
//   });
// });

// // ============================================================
// // 👤 الحصول على الملف الشخصي (Get Profile)
// // ============================================================
// export const getProfileHandler = asyncHandler(
//   async (req: Request, res: Response) => {
//     // ✅ التحقق من وجود req.user
//     if (!req.user || !req.user.id) {
//       throw createError("UNAUTHORIZED", "User not authenticated");
//     }

//     const userId = req.user.id;
//     const user = await getProfile(userId);

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   }
// );
// // ============================================================
// // ✏️ تحديث الملف الشخصي (Update Profile)
// // ============================================================
// export const updateProfileHandler = asyncHandler(
//   async (req: Request, res: Response) => {
//     if (!req.user || !req.user.id) {
//       throw createError("UNAUTHORIZED", "User not authenticated");
//     }
//     const userId = req.user.id;
//     const { name, image } = req.body;

//     const user = await updateProfile(userId, { name, image });

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: user,
//     });
//   }
// );

// // ============================================================
// // 🔑 تغيير كلمة المرور (Change Password)
// // ============================================================
// export const changePasswordHandler = asyncHandler(
//   async (req: Request, res: Response) => {
//     if (!req.user || !req.user.id) {
//       throw createError("UNAUTHORIZED", "User not authenticated");
//     }
//     const userId = req.user.id;
//     const { currentPassword, newPassword } = req.body;

//     const result = await changePassword(userId, currentPassword, newPassword);

//     res.status(200).json({
//       success: true,
//       message: result.message,
//     });
//   }
// );
// src/controllers/auth.controller.ts

import { createError } from "@/errors/app-error";
import { Request, Response } from "express";
import {
  changePassword,
  getProfile,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetUserPassword,
  updateProfile,
} from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

// ============================================================
// 📝 تسجيل مستخدم جديد (Sign Up)
// ============================================================
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const { user, token } = await registerUser(name, email, password);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: { token, user },
  });
});

// ============================================================
// 🔐 تسجيل الدخول (Sign In)
// ============================================================
export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("🔍 Backend - signIn called with email:", email);

  const { user, token } = await loginUser(email, password);
  console.log("🔍 Backend - Token generated:", token);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { token, user },
  });
});

// ============================================================
// 👤 الحصول على الملف الشخصي (Get Profile)
// ============================================================
export const getProfileHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }

    const userId = req.user.id;
    const user = await getProfile(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// ============================================================
// ✏️ تحديث الملف الشخصي (Update Profile)
// ============================================================
export const updateProfileHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { name, image } = req.body;

    const user = await updateProfile(userId, { name, image });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }
);

// ============================================================
// 🔑 تغيير كلمة المرور (Change Password)
// ============================================================
export const changePasswordHandler = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
      throw createError("UNAUTHORIZED", "User not authenticated");
    }
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const result = await changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

// ✅ طلب إعادة التعيين
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.status(200).json({ success: true, message: result.message });
  }
);

// ✅ تنفيذ إعادة التعيين
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    const result = await resetUserPassword(token as string, newPassword);
    res.status(200).json({ success: true, message: result.message });
  }
);
