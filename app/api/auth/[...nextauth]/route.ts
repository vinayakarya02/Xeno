import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db('admin'); // explicitly use 'admin' database
        const adminCol = db.collection("admin");
        const existing = await adminCol.findOne({ email: user.email });
        if (!existing) {
          await adminCol.insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error("Admin save error:", e); // Add error logging
      }
      return true;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 