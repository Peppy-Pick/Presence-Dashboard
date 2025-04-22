import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import ContactForm from "@/components/landing/ContactForm";
import FeatureCard from "@/components/landing/FeatureCard";
import { CheckCircle, MapPin, Clock, Users, Shield, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="md" />
            <span className="text-xl font-semibold text-primary">Presence</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
              Benefits
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact Us
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
            <Button onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Streamline Attendance
                <span className="text-primary"> Management</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                The modern solution for tracking employee attendance with location-based verification and powerful analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button size="lg" asChild>
                  <a href="#contact">Request Demo</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25"></div>
                <Card className="relative glass-morphism overflow-hidden rounded-lg border-0">
                  <CardContent className="p-0">
                    <img
                      src="/lovable-uploads/6142c4d9-e037-437f-80d3-f151c1fefdcc.png"
                      alt="Presence App Dashboard"
                      className="w-full h-auto animate-float"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Powerful Attendance Management Features
            </h2>
            <p className="text-muted-foreground">
              Designed to make attendance tracking seamless, accurate, and insightful for your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={MapPin}
              title="Location Verification"
              description="Ensure employees are at the designated workplace using advanced GPS technology."
            />
            <FeatureCard
              icon={Clock}
              title="Real-time Tracking"
              description="Monitor check-ins and check-outs in real-time for better management."
            />
            <FeatureCard
              icon={Users}
              title="Team Management"
              description="Organize employees into teams and departments for structured monitoring."
            />
            <FeatureCard
              icon={BarChart}
              title="Analytics Dashboard"
              description="Access comprehensive reports and insights on attendance patterns."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Reliable"
              description="Enterprise-grade security for protecting sensitive attendance data."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Compliance Ready"
              description="Built-in features to help maintain regulatory compliance for your industry."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Choose Presence?
            </h2>
            <p className="text-muted-foreground">
              Our attendance management solution provides real business value with tangible results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <Card className="card-hover border-0 shadow-md bg-gradient-to-br from-card to-secondary/10">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">For Managers & HR Teams</h3>
                <ul className="space-y-2">
                  {[
                    "Reduce manual attendance processing by 95%",
                    "Eliminate time theft and buddy punching",
                    "Generate accurate payroll reports automatically",
                    "Track attendance patterns and identify issues early",
                    "Ensure workplace compliance with detailed audit logs"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-md bg-gradient-to-br from-card to-secondary/10">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold">For Employees</h3>
                <ul className="space-y-2">
                  {[
                    "Simple one-click check-in and check-out process",
                    "View attendance history and work hours anytime",
                    "Automated notifications for schedule changes",
                    "Request time off directly through the app",
                    "Transparent attendance tracking with geolocation proof"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Ready to Transform Your Attendance Management?
              </h2>
              <p className="text-muted-foreground mb-6">
                Get in touch with our team to schedule a demo or discuss how Presence can be tailored to your organization's needs.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Our Location</h3>
                  <p className="text-muted-foreground">
                    Hilite Business Park,<br />
                    Kozhikode, Kerala - 673014,<br />
                    India
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-muted-foreground">
                    register@peppypick.com
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Logo size="sm" />
              <div>
                <span className="font-medium">Presence</span>
                <div className="text-xs text-muted-foreground">A product of ZVPL</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Presence App. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;