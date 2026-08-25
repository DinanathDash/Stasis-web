export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pb-24">
      <section className="w-full max-w-3xl px-4 mt-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: August 25, 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-muted-foreground">
          <h2>1. Introduction</h2>
          <p>
            By downloading, installing, or using Stasis, you agree to these
            Terms of Service. If you do not agree to these terms, please do not
            use the application.
          </p>

          <h2>2. License</h2>
          <p>
            Stasis is distributed under the open-source GPL-3.0 License. You are
            free to use, modify, and distribute the software in accordance with
            the terms of the GPL-3.0 License.
          </p>
          <p>
            While the underlying code is open source, the &quot;Stasis&quot;
            name, branding, and related logos remain the intellectual property
            of Dinanath Dash.
          </p>

          <h2>3. Assumption of Risk</h2>
          <p>
            Stasis interacts directly with your MacBook&apos;s System Management
            Controller (SMC) to manage hardware charge limits, thermal
            boundaries, and battery calibration.
            <strong>
              {" "}
              You acknowledge that using these features is done entirely at your
              own risk.
            </strong>
            We are not responsible for any hardware degradation, system
            instability, or unforeseen issues resulting from the use of this
            software.
          </p>

          <h2>4. Disclaimer of Warranty</h2>
          <p>
            The software is provided &quot;as is&quot;, without warranty of any
            kind, express or implied, including but not limited to the
            warranties of merchantability, fitness for a particular purpose, and
            non-infringement. In no event shall the authors or copyright holders
            be liable for any claim, damages, or other liability, whether in an
            action of contract, tort or otherwise, arising from, out of, or in
            connection with the software or the use or other dealings in the
            software.
          </p>

          <h2>5. Updates and Changes</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time.
            Your continued use of the application following any changes
            constitutes your acceptance of the new Terms.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            For any questions or concerns regarding these Terms, please reach
            out to us at{" "}
            <a href="mailto:reach@dinanath.dev">reach@dinanath.dev</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
