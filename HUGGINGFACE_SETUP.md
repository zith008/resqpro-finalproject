# Hugging Face Authentication Setup for VLM Models

## 🎯 **Complete Setup Guide**

This guide will help you set up Hugging Face authentication to download the Qwen2.5-VL models for real image analysis in your Safety Scan feature.

## 📋 **Step-by-Step Instructions**

### **Step 1: Create Hugging Face Account**

1. Go to [huggingface.co](https://huggingface.co)
2. Click "Sign Up" and create your account
3. Verify your email address

### **Step 2: Generate Access Token**

1. Go to [Hugging Face Settings > Access Tokens](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Choose "Read" permissions (sufficient for downloading models)
4. Give it a name like "ResQ Pro VLM Access"
5. Click "Generate a token"
6. **Copy the token** (starts with `hf_...`) - you won't see it again!

### **Step 3: Add Token to Your App**

1. Open your `.env` file in the project root
2. Add this line:
   ```
   EXPO_PUBLIC_HUGGINGFACE_TOKEN=hf_your_token_here
   ```
3. Replace `hf_your_token_here` with your actual token
4. Save the file

### **Step 4: Restart Your App**

1. Stop your Expo development server (Ctrl+C)
2. Run `npx expo start` again
3. The app will now load your Hugging Face token

### **Step 5: Download VLM Model**

1. Go to **Settings** tab in your app
2. Scroll to **VLM Model Settings**
3. Click **"Download VLM"** button
4. The app will now download the Qwen2.5-VL model with authentication
5. Once downloaded, click **"Load VLM"** to initialize it

## 🔧 **Technical Details**

### **Model Information**

- **Model**: Qwen2.5-VL-1.5B-Instruct
- **Size**: ~1.5GB (model + mmproj)
- **Source**: [Qwen2.5-VL GitHub](https://github.com/QwenLM/Qwen2.5-VL)
- **Authentication**: Required via Hugging Face token

### **Files Downloaded**

- `qwen2.5-vl-1.5b-instruct.gguf` - Main VLM model
- `qwen2.5-vl-1.5b-instruct-mmproj.gguf` - Multimodal projector

### **Authentication Headers**

The app now sends this header with download requests:

```
Authorization: Bearer hf_your_token_here
```

## ✅ **Testing the Setup**

1. **Check Token**: Go to Settings → VLM Model Settings
2. **Download**: Click "Download VLM" - should work without 401 errors
3. **Load**: Click "Load VLM" after download completes
4. **Test**: Go to Safety Scan tab and take a photo
5. **Verify**: Should show "Scan Safety (VLM)" instead of "(Demo)"

## 🚨 **Troubleshooting**

### **401 Unauthorized Error**

- ✅ Check your token is correct in `.env` file
- ✅ Ensure token has "Read" permissions
- ✅ Restart your app after adding the token

### **Token Not Found Error**

- ✅ Make sure `.env` file is in project root
- ✅ Check the variable name: `EXPO_PUBLIC_HUGGINGFACE_TOKEN`
- ✅ No spaces around the `=` sign

### **Download Fails**

- ✅ Check your internet connection
- ✅ Verify the token is valid at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- ✅ Try generating a new token

## 🔒 **Security Notes**

- **Never commit your token** to version control
- **Add `.env` to `.gitignore`** if not already there
- **Use "Read" permissions only** - no need for write access
- **Regenerate token** if you suspect it's compromised

## 🎉 **Success!**

Once set up correctly, you'll have:

- ✅ Real image analysis with Qwen2.5-VL
- ✅ Authentic safety suggestions based on actual photos
- ✅ Full VLM functionality in Safety Scan
- ✅ No more demo mode limitations

## 📚 **Additional Resources**

- [Hugging Face Token Documentation](https://huggingface.co/docs/hub/security-tokens)
- [Qwen2.5-VL Model Page](https://huggingface.co/Qwen/Qwen2.5-VL-1.5B-Instruct-GGUF)
- [Cactus React Native Documentation](https://cactuscompute.com/docs/react-native)

---

**Need Help?** Check the console logs for detailed error messages and ensure your token is properly configured.
