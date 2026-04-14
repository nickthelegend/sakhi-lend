import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card" id="contact">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <span className="text-2xl font-semibold tracking-tight text-foreground">
                Sakhi<span className="text-primary">lend</span>
              </span>
            </Link>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Empowering women through accessible finance. A community-powered lending platform built on trust and transparency.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/beneficiary/login" className="text-muted-foreground hover:text-primary">
                  Beneficiary Login
                </Link>
              </li>
              <li>
                <Link href="/lender/login" className="text-muted-foreground hover:text-primary">
                  Become a Lender
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@sakhilend.com</li>
              <li>+91 98765 43210</li>
              <li>Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sakhilend. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
