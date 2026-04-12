"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Bell,
  Shield,
  Percent,
  Save,
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="ml-12 lg:ml-0">
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure platform settings</p>
            </div>
            <Button className="gap-2 rounded-full">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  Loan Settings
                </CardTitle>
                <CardDescription>Configure loan parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Interest Rate (%)</Label>
                  <Input type="number" defaultValue="12" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Loan Amount (₹)</Label>
                  <Input type="number" defaultValue="50000" />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Trust Score for Loan</Label>
                  <Input type="number" defaultValue="650" />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Loan Tenure (months)</Label>
                  <Input type="number" defaultValue="24" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure security parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin access</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Auto-Logout</p>
                    <p className="text-sm text-muted-foreground">Logout after 30 min inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">IP Whitelisting</p>
                    <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure email and SMS notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">New Registration Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of new beneficiaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Loan Approval Requests</p>
                    <p className="text-sm text-muted-foreground">Get notified of pending loans</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Payment Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of EMI payments</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Overdue Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of overdue payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
                <CardDescription>System information and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                  <span className="text-muted-foreground">Platform Version</span>
                  <Badge>v2.5.0</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                  <span className="text-muted-foreground">Last Backup</span>
                  <span className="font-medium">Apr 3, 2026 02:00 AM</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                  <span className="text-muted-foreground">Server Status</span>
                  <Badge className="bg-chart-2/20 text-chart-2">Healthy</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
