// ============================================
// ALPACA BROKER API - FULL BROKERAGE ACCOUNTS
// For Real Stock Trading with Advisor Management
// ============================================

const ALPACA_BROKER_URL = import.meta.env.VITE_ALPACA_BROKER_URL || "https://broker-api.sandbox.alpaca.markets"
const ALPACA_BROKER_KEY = import.meta.env.VITE_ALPACA_BROKER_KEY
const ALPACA_BROKER_SECRET = import.meta.env.VITE_ALPACA_BROKER_SECRET

// ============================================
// ACCOUNT OPENING & KYC
// ============================================

export const brokerAPI = {
  // Create new brokerage account with KYC information
  createAccount: async (accountData) => {
    const response = await fetch(`${ALPACA_BROKER_URL}/v1/accounts`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: {
          email_address: accountData.email,
          phone_number: accountData.phone,
          street_address: [accountData.address],
          city: accountData.city,
          state: accountData.state,
          postal_code: accountData.zip,
          country: "USA",
        },
        identity: {
          given_name: accountData.firstName,
          family_name: accountData.lastName,
          date_of_birth: accountData.dateOfBirth,
          tax_id_type: "USA_SSN",
          tax_id: accountData.ssn,
          country_of_citizenship: "USA",
          country_of_birth: "USA",
          country_of_tax_residence: "USA",
          funding_source: [accountData.fundingSource || "employment_income"],
        },
        disclosures: {
          is_control_person: accountData.isControlPerson || false,
          is_affiliated_exchange_or_finra: accountData.isAffiliated || false,
          is_politically_exposed: accountData.isPoliticallyExposed || false,
          immediate_family_exposed: accountData.familyExposed || false,
          employment_status: accountData.employmentStatus || "employed",
          employer_name: accountData.employerName,
          employer_address: accountData.employerAddress,
        },
        agreements: [
          {
            agreement: "margin_agreement",
            signed_at: new Date().toISOString(),
            ip_address: accountData.ipAddress,
          },
          {
            agreement: "account_agreement",
            signed_at: new Date().toISOString(),
            ip_address: accountData.ipAddress,
          },
          {
            agreement: "customer_agreement",
            signed_at: new Date().toISOString(),
            ip_address: accountData.ipAddress,
          },
        ],
        documents: accountData.identityDocuments || [],
        trusted_contact: accountData.trustedContact,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create account")
    }

    return response.json()
  },

  // Get account details
  getAccount: async (accountId) => {
    const response = await fetch(`${ALPACA_BROKER_URL}/v1/accounts/${accountId}`, {
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
      },
    })

    if (!response.ok) throw new Error("Failed to fetch account")
    return response.json()
  },

  // Update account information
  updateAccount: async (accountId, updates) => {
    const response = await fetch(`${ALPACA_BROKER_URL}/v1/accounts/${accountId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) throw new Error("Failed to update account")
    return response.json()
  },

  // Upload identity documents
  uploadDocument: async (accountId, documentData) => {
    const formData = new FormData()
    formData.append("document_type", documentData.type) // 'identity_verification' or 'address_verification'
    formData.append("document_sub_type", documentData.subType) // 'passport', 'drivers_license', etc.
    formData.append("content", documentData.file)
    formData.append("mime_type", documentData.mimeType)

    const response = await fetch(`${ALPACA_BROKER_URL}/v1/accounts/${accountId}/documents`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
      },
      body: formData,
    })

    if (!response.ok) throw new Error("Failed to upload document")
    return response.json()
  },

  // Check KYC status
  getKYCStatus: async (accountId) => {
    const account = await brokerAPI.getAccount(accountId)
    return {
      status: account.status,
      kycStatus: account.identity_verified ? "verified" : "pending",
      accountApproved: account.status === "ACTIVE",
      canTrade: account.enabled && account.status === "ACTIVE",
    }
  },
}

// ============================================
// ADVISOR & DISCRETIONARY MANAGEMENT
// ============================================

export const advisorAPI = {
  // Grant discretionary trading authority to SaintSal
  grantDiscretionaryAuthority: async (accountId, advisorAgreement) => {
    // This would typically involve additional legal agreements
    // For Alpaca, we'd set up OAuth or API keys for the advisor to trade on behalf of client
    const response = await fetch(`${ALPACA_BROKER_URL}/v1/accounts/${accountId}/relationships`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        relationship_type: "advisor",
        discretionary: true,
        signed_at: new Date().toISOString(),
        agreement_version: advisorAgreement.version,
        ip_address: advisorAgreement.ipAddress,
      }),
    })

    if (!response.ok) throw new Error("Failed to grant authority")
    return response.json()
  },

  // Execute trades on behalf of client (by SaintSal)
  executeAdvisoryTrade: async (accountId, order) => {
    const response = await fetch(`${ALPACA_BROKER_URL}/v1/trading/accounts/${accountId}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: order.symbol,
        qty: order.quantity,
        side: order.side, // 'buy' or 'sell'
        type: order.type || "market",
        time_in_force: order.timeInForce || "day",
        client_order_id: `sal_${Date.now()}`,
        extended_hours: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Trade execution failed")
    }

    return response.json()
  },
}

// ============================================
// ACCOUNT FUNDING & TRANSFERS
// ============================================

export const fundingAPI = {
  // Create ACH relationship
  createACHRelationship: async (accountId, bankData) => {
    const response = await fetch(`${ALPACA_BROKER_URL}/v1/accounts/${accountId}/ach_relationships`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_owner_name: bankData.accountOwnerName,
        bank_account_type: bankData.accountType, // 'CHECKING' or 'SAVINGS'
        bank_account_number: bankData.accountNumber,
        bank_routing_number: bankData.routingNumber,
        nickname: bankData.nickname || "Primary Bank",
      }),
    })

    if (!response.ok) throw new Error("Failed to link bank account")
    return response.json()
  },

  // Transfer funds (deposit/withdrawal)
  createTransfer: async (accountId, transferData) => {
    const response = await fetch(`${ALPACA_BROKER_URL}/v1/accounts/${accountId}/transfers`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transfer_type: "ach",
        relationship_id: transferData.relationshipId,
        amount: transferData.amount.toString(),
        direction: transferData.direction, // 'INCOMING' or 'OUTGOING'
        timing: transferData.timing || "immediate",
      }),
    })

    if (!response.ok) throw new Error("Transfer failed")
    return response.json()
  },

  // Get all transfers
  getTransfers: async (accountId) => {
    const response = await fetch(`${ALPACA_BROKER_URL}/v1/accounts/${accountId}/transfers`, {
      headers: {
        Authorization: `Basic ${btoa(`${ALPACA_BROKER_KEY}:${ALPACA_BROKER_SECRET}`)}`,
      },
    })

    if (!response.ok) throw new Error("Failed to fetch transfers")
    return response.json()
  },
}
