"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Chrome, ArrowLeft, User, AlertCircle, Github } from "lucide-react"
import Link from "next/link"
import { signIn, getSession } from "next-auth/react"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/")
      }
    })

    // Check for OAuth errors
    const error = searchParams.get("error")
    if (error) {
      setError("Authentication failed. Please try again.")
    }
  }, [router, searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      })

      if (result?.error) {
        setError("Authentication failed. Please try again.")
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (err) {
      setError("Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: string) => {
    setError("")
    setLoading(true)

    try {
      const result = await signIn(provider, {
        callbackUrl: "/",
        redirect: false,
      })

      if (result?.error) {
        setError(`Failed to sign up with ${provider}`)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (err) {
      setError(`Failed to sign up with ${provider}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(0, 255, 102, 0.08) 0%, rgba(0, 255, 102, 0.02) 60%, transparent 90%)`,
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#15cb5e] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <span className="text-3xl font-bold text-white">CareerSync</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Start your AI-powered career journey today</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign up for CareerSync</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleOAuthSignUp("google")}
                disabled={loading}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
              <Button
                onClick={() => handleOAuthSignUp("github")}
                disabled={loading}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl"
              >
                <Github className="w-5 h-5 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <Separator className="bg-white/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black px-4 text-gray-400 text-sm">or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white rounded-xl"
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white rounded-xl"
                  required
                />
              </div>

              <div>
                <Input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#15cb5e] hover:bg-[#12b854] text-black rounded-xl"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-[#15cb5e] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
