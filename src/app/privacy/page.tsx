import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Stasis. Learn how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      <section className="w-full max-w-3xl px-4 mt-8 md:mt-20">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: August 25, 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-muted-foreground">
          <h2>1. Introduction</h2>
          <p>
            Stasis is a local, open-source macOS utility designed to manage your
            MacBook&apos;s battery and power settings. We believe your hardware
            and data belong to you. This Privacy Policy outlines our commitment
            to your privacy.
          </p>

          <h2>2. Local First & No Telemetry</h2>
          <p>
            Stasis operates entirely locally on your machine. We{" "}
            <strong>do not</strong> collect, store, transmit, or monetize any
            personal information, usage analytics, telemetry, or battery
            metrics. All processing and data storage happens strictly on your
            device.
          </p>

          <h2>3. Network Activity</h2>
          <p>
            Stasis makes minimal network requests for functional purposes only:
          </p>
          <ul>
            <li>
              <strong>Updates:</strong> The app periodically contacts the GitHub
              API (<code>api.github.com</code>) to check for new releases and
              updates. No personally identifiable information is sent during
              these checks.
            </li>
          </ul>

          <h2>4. Open Source Transparency</h2>
          <p>
            Stasis is completely open source under the GPL-3.0 License. This
            ensures complete transparency regarding how the application works
            under the hood. Anyone can audit the source code to verify our
            privacy commitments.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            Stasis, please contact us at{" "}
            <a href="mailto:reach@dinanath.dev">reach@dinanath.dev</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
