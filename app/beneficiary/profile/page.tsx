"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BeneficiarySidebar } from "@/components/beneficiary-sidebar"
import {
  Phone,
  MapPin,
  Mail,
  Shield,
  Edit,
} from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <BeneficiarySidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your personal information</p>
            </div>
            <Button className="gap-2 rounded-full">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-accent">
                    <Image
                      src="/images/beneficiary-woman.jpg"
                      alt="Profile"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Priya Sharma</h2>
                  <p className="text-sm text-muted-foreground">Member since Jan 2026</p>
                  <Badge className="mt-3 bg-chart-2/20 text-chart-2">Verified</Badge>

                  <div className="mt-6 w-full rounded-xl bg-accent/50 p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Trust Score</span>
                    </div>
                    <p className="mt-1 text-3xl font-bold text-primary">750</p>
                    <p className="text-xs text-muted-foreground">Excellent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your registered details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value="Priya Sharma" readOnly className="bg-accent/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input value="+91 98765 43210" readOnly className="bg-accent/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input value="priya.sharma@email.com" readOnly className="bg-accent/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input value="15 March 1990" readOnly className="bg-accent/50" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Address</Label>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-3 h-4 w-4 text-muted-foreground" />
                      <Input value="Village Sundarpur, Block Chandauli, District Varanasi, UP - 221008" readOnly className="bg-accent/50" />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 font-semibold text-foreground">Bank Details</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input value="State Bank of India" readOnly className="bg-accent/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input value="XXXX XXXX 4521" readOnly className="bg-accent/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>IFSC Code</Label>
                      <Input value="SBIN0001234" readOnly className="bg-accent/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Branch</Label>
                      <Input value="Chandauli Main Branch" readOnly className="bg-accent/50" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
