// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import connectDB from "@/app/lib/mongodb";
// import File from "@/app/lib/models/File";

// export async function GET() {
//   await connectDB();
//   try {
//     const files = await File.find({});
//     return NextResponse.json(files, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch files" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   await connectDB();
//   try {
//     const { name, content } = await req.json();
//     const newFile = new File({ name, content });
//     await newFile.save();
//     return NextResponse.json(newFile, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create file" },
//       { status: 400 }
//     );
//   }
// }

// export async function PUT(req) {
//   await connectDB();
//   try {
//     const { id, content } = await req.json();
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
//     }
//     const updatedFile = await File.findByIdAndUpdate(
//       id,
//       { content },
//       { new: true }
//     );
//     return NextResponse.json(updatedFile, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to update file" },
//       { status: 400 }
//     );
//   }
// }

// export async function DELETE(req) {
//   await connectDB();
//   try {
//     const { id } = await req.json();
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
//     }
//     await File.findByIdAndDelete(id);
//     return NextResponse.json(
//       { message: "File deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete file" },
//       { status: 400 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import File from "@/app/lib/models/File";

// Fetch all files (GET /api/files)
export async function GET() {
  await connectDB(); // Ensure DB connection
  try {
    const files = await File.find({});
    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

// Create a new file (POST /api/files)
export async function POST(req) {
  await connectDB(); // Ensure DB connection
  try {
    const { name, content } = await req.json();
    const newFile = new File({ name, content });
    await newFile.save();
    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create file" },
      { status: 400 }
    );
  }
}

// Update file content (PUT /api/files)
export async function PUT(req) {
  await connectDB(); // Ensure DB connection
  try {
    const { id, name, content } = await req.json();
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    // Update file name or content if provided
    const updatedFile = await File.findByIdAndUpdate(
      id,
      { ...(name && { name }), ...(content && { content }) }, 
      { new: true }
    );

    if (!updatedFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFile, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 400 }
    );
  }
}

// Delete a file (DELETE /api/files)
export async function DELETE(req) {
  await connectDB(); // Ensure DB connection
  try {
    const { id } = await req.json();

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    await File.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 400 }
    );
  }
}
