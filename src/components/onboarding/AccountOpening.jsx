"use client"

import { useState } from "react"
import { Button, Input, Card } from "../index"
import { brokerAPI } from "../../lib/broker-api"
import { supabase } from "../../lib/supabase"

const colors = {
  background: "#0a0a0a",
  surface: "#141414",
  border: "#2a2a2a",
  gold: "#d4af37",
  textPrimary: "#ffffff",
  textSecondary: "#a0a0a0",
  success: "#10b981",
  error: "#ef4444",
}

export const AccountOpeningFlow = ({ userId, onComplete }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    ssn: "",
    phone: "",
    email: "",
    citizenship: "USA",
    // Address
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    // Employment
    employmentStatus: "employed",
    employerName: "",
    employerAddress: "",
    occupation: "",
    // Financial
    annualIncome: "100k_200k",
    netWorth: "200k_500k",
    liquidNetWorth: "100k_200k",
    fundingSource: ["employment_income"],
    // Disclosures
    isControlPerson: false,
    isAffiliated: false,
    isPoliticallyExposed: false,
    familyExposed: false,
    investmentExperience: "good",
    riskTolerance: "moderate",
    // Trusted Contact
    trustedContactName: "",
    trustedContactEmail: "",
    trustedContactPhone: "",
    trustedContactRelationship: "spouse",
    // Agreements
    agreedToTerms: false,
    agreedToAdvisory: false,
    agreedToRiskDisclosure: false,
    agreedToPrivacyPolicy: false,
  })

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Step 1: Create Alpaca brokerage account
      const alpacaAccount = await brokerAPI.createAccount({
        ...formData,
        ipAddress: await fetch("https://api.ipify.org?format=json")
          .then((r) => r.json())
          .then((data) => data.ip),
      })

      // Step 2: Save to Supabase
      const { error: kycError } = await supabase.from("kyc_information").insert({
        user_id: userId,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        ssn_encrypted: formData.ssn, // TODO: Encrypt in production
        address: formData.address,
        address_line2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip,
        phone: formData.phone,
        employment_status: formData.employmentStatus,
        employer_name: formData.employerName,
        employer_address: formData.employerAddress,
        occupation: formData.occupation,
        annual_income_range: formData.annualIncome,
        net_worth_range: formData.netWorth,
        liquid_net_worth_range: formData.liquidNetWorth,
        funding_source: formData.fundingSource,
        verification_status: "pending",
      })

      if (kycError) throw kycError

      // Step 3: Create brokerage account record
      const { error: brokerageError } = await supabase.from("brokerage_accounts").insert({
        user_id: userId,
        alpaca_account_id: alpacaAccount.id,
        account_number: alpacaAccount.account_number,
        account_status: alpacaAccount.status,
        account_type: "individual",
      })

      if (brokerageError) throw brokerageError

      // Step 4: Save disclosures
      const { error: disclosureError } = await supabase.from("regulatory_disclosures").insert({
        user_id: userId,
        is_control_person: formData.isControlPerson,
        is_affiliated_exchange_or_finra: formData.isAffiliated,
        is_politically_exposed: formData.isPoliticallyExposed,
        immediate_family_exposed: formData.familyExposed,
        investment_experience: formData.investmentExperience,
        risk_tolerance: formData.riskTolerance,
        investment_objectives: ["growth", "income"],
      })

      if (disclosureError) throw disclosureError

      // Step 5: Save agreements
      const agreements = [
        { type: "customer_agreement", agreed: formData.agreedToTerms },
        { type: "advisory_agreement", agreed: formData.agreedToAdvisory },
        { type: "risk_disclosure", agreed: formData.agreedToRiskDisclosure },
        { type: "privacy_policy", agreed: formData.agreedToPrivacyPolicy },
      ]

      const ipAddress = await fetch("https://api.ipify.org?format=json")
        .then((r) => r.json())
        .then((data) => data.ip)

      for (const agreement of agreements) {
        if (agreement.agreed) {
          await supabase.from("legal_agreements").insert({
            user_id: userId,
            agreement_type: agreement.type,
            agreement_version: "1.0",
            ip_address: ipAddress,
            user_agent: navigator.userAgent,
          })
        }
      }

      // Step 6: Save trusted contact
      if (formData.trustedContactName) {
        await supabase.from("trusted_contacts").insert({
          user_id: userId,
          full_name: formData.trustedContactName,
          email: formData.trustedContactEmail,
          phone: formData.trustedContactPhone,
          relationship: formData.trustedContactRelationship,
          is_primary: true,
        })
      }

      onComplete(alpacaAccount)
    } catch (error) {
      console.error("Account opening error:", error)
      alert("Failed to open account: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoStep formData={formData} updateField={updateField} />
      case 2:
        return <AddressStep formData={formData} updateField={updateField} />
      case 3:
        return <EmploymentStep formData={formData} updateField={updateField} />
      case 4:
        return <FinancialInfoStep formData={formData} updateField={updateField} />
      case 5:
        return <DisclosuresStep formData={formData} updateField={updateField} />
      case 6:
        return <TrustedContactStep formData={formData} updateField={updateField} />
      case 7:
        return <AgreementsStep formData={formData} updateField={updateField} />
      default:
        return null
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: s <= step ? colors.gold : colors.surface,
                border: `2px solid ${s <= step ? colors.gold : colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s <= step ? "#0a0a0a" : colors.textSecondary,
                fontWeight: 600,
              }}
            >
              {s}
            </div>
          ))}
        </div>
        <div style={{ height: 4, background: colors.surface, borderRadius: 2, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(step / 7) * 100}%`,
              background: `linear-gradient(90deg, ${colors.gold} 0%, #f4d03f 100%)`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Current Step */}
      <Card>{renderStep()}</Card>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        {step > 1 && (
          <Button fullWidth onClick={() => setStep(step - 1)} disabled={loading}>
            Back
          </Button>
        )}
        {step < 7 ? (
          <Button primary fullWidth onClick={() => setStep(step + 1)} disabled={loading}>
            Continue
          </Button>
        ) : (
          <Button primary fullWidth onClick={handleSubmit} loading={loading}>
            Submit Application
          </Button>
        )}
      </div>
    </div>
  )
}

// Individual step components
const PersonalInfoStep = ({ formData, updateField }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h2 style={{ color: colors.gold, fontSize: 24, fontWeight: 700, margin: 0 }}>Personal Information</h2>
    <p style={{ color: colors.textSecondary, margin: 0 }}>
      We need this information to verify your identity and comply with federal regulations.
    </p>
    <Input
      label="Legal First Name"
      value={formData.firstName}
      onChange={(e) => updateField("firstName", e.target.value)}
      required
    />
    <Input
      label="Middle Name (Optional)"
      value={formData.middleName}
      onChange={(e) => updateField("middleName", e.target.value)}
    />
    <Input
      label="Legal Last Name"
      value={formData.lastName}
      onChange={(e) => updateField("lastName", e.target.value)}
      required
    />
    <Input
      label="Date of Birth"
      type="date"
      value={formData.dateOfBirth}
      onChange={(e) => updateField("dateOfBirth", e.target.value)}
      required
    />
    <Input
      label="Social Security Number"
      type="password"
      value={formData.ssn}
      onChange={(e) => updateField("ssn", e.target.value)}
      placeholder="XXX-XX-XXXX"
      required
    />
    <Input
      label="Phone Number"
      type="tel"
      value={formData.phone}
      onChange={(e) => updateField("phone", e.target.value)}
      required
    />
    <Input
      label="Email Address"
      type="email"
      value={formData.email}
      onChange={(e) => updateField("email", e.target.value)}
      required
    />
  </div>
)

const AddressStep = ({ formData, updateField }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h2 style={{ color: colors.gold, fontSize: 24, fontWeight: 700, margin: 0 }}>Residential Address</h2>
    <p style={{ color: colors.textSecondary, margin: 0 }}>
      Your primary residential address. P.O. boxes are not accepted.
    </p>
    <Input
      label="Street Address"
      value={formData.address}
      onChange={(e) => updateField("address", e.target.value)}
      required
    />
    <Input
      label="Apartment, Suite, etc. (Optional)"
      value={formData.addressLine2}
      onChange={(e) => updateField("addressLine2", e.target.value)}
    />
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
      <Input label="City" value={formData.city} onChange={(e) => updateField("city", e.target.value)} required />
      <Input label="State" value={formData.state} onChange={(e) => updateField("state", e.target.value)} required />
      <Input label="ZIP Code" value={formData.zip} onChange={(e) => updateField("zip", e.target.value)} required />
    </div>
  </div>
)

const EmploymentStep = ({ formData, updateField }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h2 style={{ color: colors.gold, fontSize: 24, fontWeight: 700, margin: 0 }}>Employment Information</h2>
    <p style={{ color: colors.textSecondary, margin: 0 }}>Required by FINRA regulations.</p>
    <select
      value={formData.employmentStatus}
      onChange={(e) => updateField("employmentStatus", e.target.value)}
      style={{
        padding: 12,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        color: colors.textPrimary,
        fontSize: 14,
      }}
    >
      <option value="employed">Employed</option>
      <option value="self_employed">Self-Employed</option>
      <option value="unemployed">Unemployed</option>
      <option value="retired">Retired</option>
      <option value="student">Student</option>
    </select>
    {(formData.employmentStatus === "employed" || formData.employmentStatus === "self_employed") && (
      <>
        <Input
          label="Employer Name"
          value={formData.employerName}
          onChange={(e) => updateField("employerName", e.target.value)}
          required
        />
        <Input
          label="Occupation / Job Title"
          value={formData.occupation}
          onChange={(e) => updateField("occupation", e.target.value)}
          required
        />
      </>
    )}
  </div>
)

const FinancialInfoStep = ({ formData, updateField }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h2 style={{ color: colors.gold, fontSize: 24, fontWeight: 700, margin: 0 }}>Financial Information</h2>
    <p style={{ color: colors.textSecondary, margin: 0 }}>
      Helps us understand your financial situation and investment needs.
    </p>
    <div>
      <label style={{ color: colors.textPrimary, fontSize: 14, display: "block", marginBottom: 8 }}>
        Annual Income Range
      </label>
      <select
        value={formData.annualIncome}
        onChange={(e) => updateField("annualIncome", e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: colors.textPrimary,
        }}
      >
        <option value="under_25k">Under $25,000</option>
        <option value="25k_50k">$25,000 - $50,000</option>
        <option value="50k_100k">$50,000 - $100,000</option>
        <option value="100k_200k">$100,000 - $200,000</option>
        <option value="200k_300k">$200,000 - $300,000</option>
        <option value="over_300k">Over $300,000</option>
      </select>
    </div>
    <div>
      <label style={{ color: colors.textPrimary, fontSize: 14, display: "block", marginBottom: 8 }}>
        Net Worth Range
      </label>
      <select
        value={formData.netWorth}
        onChange={(e) => updateField("netWorth", e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: colors.textPrimary,
        }}
      >
        <option value="under_50k">Under $50,000</option>
        <option value="50k_200k">$50,000 - $200,000</option>
        <option value="200k_500k">$200,000 - $500,000</option>
        <option value="500k_1m">$500,000 - $1,000,000</option>
        <option value="over_1m">Over $1,000,000</option>
      </select>
    </div>
  </div>
)

const DisclosuresStep = ({ formData, updateField }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <h2 style={{ color: colors.gold, fontSize: 24, fontWeight: 700, margin: 0 }}>Regulatory Disclosures</h2>
    <p style={{ color: colors.textSecondary, margin: 0 }}>Required by FINRA and SEC regulations.</p>

    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={formData.isControlPerson}
        onChange={(e) => updateField("isControlPerson", e.target.checked)}
        style={{ marginTop: 4 }}
      />
      <div>
        <div style={{ color: colors.textPrimary, fontWeight: 600, marginBottom: 4 }}>Control Person</div>
        <div style={{ color: colors.textSecondary, fontSize: 13 }}>
          Are you a director, 10% shareholder, or policy-making officer of a publicly traded company?
        </div>
      </div>
    </label>

    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={formData.isAffiliated}
        onChange={(e) => updateField("isAffiliated", e.target.checked)}
        style={{ marginTop: 4 }}
      />
      <div>
        <div style={{ color: colors.textPrimary, fontWeight: 600, marginBottom: 4 }}>Exchange or FINRA Affiliation</div>
        <div style={{ color: colors.textSecondary, fontSize: 13 }}>
          Are you affiliated with a stock exchange or FINRA member firm?
        </div>
      </div>
    </label>

    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={formData.isPoliticallyExposed}
        onChange={(e) => updateField("isPoliticallyExposed", e.target.checked)}
        style={{ marginTop: 4 }}
      />
      <div>
        <div style={{ color: colors.textPrimary, fontWeight: 600, marginBottom: 4 }}>Politically Exposed Person</div>
        <div style={{ color: colors.textSecondary, fontSize: 13 }}>
          Are you or an immediate family member a senior political figure?
        </div>
      </div>
    </label>

    <div>
      <label style={{ color: colors.textPrimary, fontSize: 14, display: "block", marginBottom: 8 }}>
        Investment Experience
      </label>
      <select
        value={formData.investmentExperience}
        onChange={(e) => updateField("investmentExperience", e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: colors.textPrimary,
        }}
      >
        <option value="none">None</option>
        <option value="limited">Limited (less than 2 years)</option>
        <option value="good">Good (2-5 years)</option>
        <option value="extensive">Extensive (5+ years)</option>
      </select>
    </div>

    <div>
      <label style={{ color: colors.textPrimary, fontSize: 14, display: "block", marginBottom: 8 }}>
        Risk Tolerance
      </label>
      <select
        value={formData.riskTolerance}
        onChange={(e) => updateField("riskTolerance", e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: colors.textPrimary,
        }}
      >
        <option value="conservative">Conservative - Preserve capital, minimal risk</option>
        <option value="moderate">Moderate - Balanced growth and preservation</option>
        <option value="aggressive">Aggressive - High growth potential, higher risk</option>
        <option value="speculative">Speculative - Maximum growth, maximum risk</option>
      </select>
    </div>
  </div>
)

const TrustedContactStep = ({ formData, updateField }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <h2 style={{ color: colors.gold, fontSize: 24, fontWeight: 700, margin: 0 }}>Trusted Contact (Optional)</h2>
    <p style={{ color: colors.textSecondary, margin: 0 }}>
      Someone we can contact in case of suspected fraud or cognitive impairment.
    </p>
    <Input
      label="Full Name"
      value={formData.trustedContactName}
      onChange={(e) => updateField("trustedContactName", e.target.value)}
    />
    <Input
      label="Email"
      type="email"
      value={formData.trustedContactEmail}
      onChange={(e) => updateField("trustedContactEmail", e.target.value)}
    />
    <Input
      label="Phone"
      type="tel"
      value={formData.trustedContactPhone}
      onChange={(e) => updateField("trustedContactPhone", e.target.value)}
    />
    <div>
      <label style={{ color: colors.textPrimary, fontSize: 14, display: "block", marginBottom: 8 }}>Relationship</label>
      <select
        value={formData.trustedContactRelationship}
        onChange={(e) => updateField("trustedContactRelationship", e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          color: colors.textPrimary,
        }}
      >
        <option value="spouse">Spouse</option>
        <option value="parent">Parent</option>
        <option value="sibling">Sibling</option>
        <option value="child">Child</option>
        <option value="friend">Friend</option>
        <option value="attorney">Attorney</option>
        <option value="advisor">Financial Advisor</option>
        <option value="other">Other</option>
      </select>
    </div>
  </div>
)

const AgreementsStep = ({ formData, updateField }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <h2 style={{ color: colors.gold, fontSize: 24, fontWeight: 700, margin: 0 }}>Agreements & Disclosures</h2>
    <p style={{ color: colors.textSecondary, margin: 0 }}>
      Please review and accept the following to complete your application.
    </p>

    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={formData.agreedToTerms}
        onChange={(e) => updateField("agreedToTerms", e.target.checked)}
        style={{ marginTop: 4 }}
      />
      <div>
        <div style={{ color: colors.textPrimary, fontWeight: 600, marginBottom: 4 }}>Customer Agreement *</div>
        <div style={{ color: colors.textSecondary, fontSize: 13 }}>
          I agree to the{" "}
          <a href="/legal/customer-agreement" target="_blank" style={{ color: colors.gold }} rel="noreferrer">
            Customer Agreement
          </a>{" "}
          and account terms
        </div>
      </div>
    </label>

    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={formData.agreedToAdvisory}
        onChange={(e) => updateField("agreedToAdvisory", e.target.checked)}
        style={{ marginTop: 4 }}
      />
      <div>
        <div style={{ color: colors.textPrimary, fontWeight: 600, marginBottom: 4 }}>
          Investment Advisory Agreement *
        </div>
        <div style={{ color: colors.textSecondary, fontSize: 13 }}>
          I authorize SaintSal™ AI to provide investment advice and execute trades on my behalf. I understand SaintSal™
          uses algorithms and AI to manage my portfolio.
        </div>
      </div>
    </label>

    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={formData.agreedToRiskDisclosure}
        onChange={(e) => updateField("agreedToRiskDisclosure", e.target.checked)}
        style={{ marginTop: 4 }}
      />
      <div>
        <div style={{ color: colors.textPrimary, fontWeight: 600, marginBottom: 4 }}>Risk Disclosure *</div>
        <div style={{ color: colors.textSecondary, fontSize: 13 }}>
          I understand that investing involves risk, including possible loss of principal. Past performance does not
          guarantee future results.
        </div>
      </div>
    </label>

    <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={formData.agreedToPrivacyPolicy}
        onChange={(e) => updateField("agreedToPrivacyPolicy", e.target.checked)}
        style={{ marginTop: 4 }}
      />
      <div>
        <div style={{ color: colors.textPrimary, fontWeight: 600, marginBottom: 4 }}>Privacy Policy *</div>
        <div style={{ color: colors.textSecondary, fontSize: 13 }}>
          I have reviewed the{" "}
          <a href="/legal/privacy" target="_blank" style={{ color: colors.gold }} rel="noreferrer">
            Privacy Policy
          </a>
        </div>
      </div>
    </label>

    <div
      style={{
        padding: 16,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        marginTop: 16,
      }}
    >
      <div style={{ color: colors.textPrimary, fontSize: 13, lineHeight: 1.6 }}>
        By submitting this application, I certify that all information provided is true and accurate. I authorize
        CookinSaints to verify this information and conduct background checks as required by law.
      </div>
    </div>
  </div>
)
