# MaintenanceOps: API Integration Guide

This document outlines the expected API endpoints, request payloads, and response structures required to drive the React frontend dashboards for **Requesters**, **Admins**, and **Super Admins**.

---

## 1. Requester Workflow (User Dashboard)

### 1.1 Create New Request
Triggered from the **New Request Modal** by a standard user (`REQUESTER` role).

- **Endpoint:** `POST /api/requests`
- **Method:** `POST`
- **Frontend Source:** `src/components/requests/NewRequestModal.jsx`

**Request Payload:**
```json
{
  "department": "Electrical", // String [Electrical, Plumbing, Carpentry, Estate Management]
  "location": "Conference Room A", // String
  "description": "AC is blowing warm air", // String
  "priority": "High", // String [Low, Medium, High, Critical]
  "attachmentUrl": "https://storage.provider/image.jpg" // Optional String
}
```

**Expected Response (201 Created):**
```json
{
  "id": "REQ-2024-001",
  "status": "SUBMITTED",
  "createdAt": "2024-10-25T10:00:00Z"
}
```

---

## 2. Admin Workflow (Admin Dashboard)

### 2.1 Fetch Action Queue
Fetches requests that are `SUBMITTED` and waiting for the first layer of Admin review.

- **Endpoint:** `GET /api/requests?status=SUBMITTED`
- **Frontend Source:** `src/components/dashboard/admin/ActionQueue.jsx`

### 2.2 Review & Forward Request to Super Admin
Triggered when an Admin reviews a request and clicks "Forward to Super Admin".

- **Endpoint:** `PUT /api/requests/:id/review`
- **Method:** `PUT`
- **Frontend Source:** `src/components/dashboard/admin/ActionQueue.jsx` (Action handler)

**Request Payload:**
```json
{
  "status": "PENDING_SA_APPROVAL", // The new status after admin reviews
  "adminRemarks": "Feasible to complete. Electrical team available next week.",
  "adminId": "admin_uuid_123" // Or inferred from Auth Token
}
```

**Expected Response (200 OK):**
```json
{
  "id": "REQ-2024-001",
  "status": "PENDING_SA_APPROVAL",
  "adminReviewedAt": "2024-10-25T11:30:00Z"
}
```

---

## 3. Super Admin Workflow (Super Admin Dashboard)

### 3.1 Fetch Approval Queue
Fetches requests that have been reviewed by Admins and need financial/final approval.

- **Endpoint:** `GET /api/requests?status=PENDING_SA_APPROVAL`
- **Frontend Source:** `src/components/dashboard/superadmin/ApprovalQueue.jsx`

**Important Note:** The backend response for this `GET` request MUST include the original `description` (or `req` in the mock data) provided by the Requester, so that the Super Admin can review the full context inside the Quotation Entry Modal before approving.

### 3.2 Approve Request & Provide Quotation
Triggered from the **QuotationEntryModal** when a Super Admin approves a request.

- **Endpoint:** `PUT /api/requests/:id/approve`
- **Method:** `PUT`
- **Frontend Source:** `src/components/dashboard/superadmin/QuotationEntryModal.jsx`

**Request Payload:**
```json
{
  "status": "APPROVED", // Or "APPROVED_WITH_QUOTATION" depending on backend state machine
  "quotationAmount": 5000.00, // Number (Float)
  "requiredDate": "2024-11-05", // String (YYYY-MM-DD format from HTML Date Input)
  "quotationDescription": "Parts: AC Compressor (₹3500), Labor (₹1500)", // String
  "superAdminRemarks": "Approved. Expedite the parts order.", // String
  "superAdminId": "superadmin_uuid_456" // Or inferred from Auth Token
}
```

**Expected Response (200 OK):**
```json
{
  "id": "REQ-2024-001",
  "status": "APPROVED",
  "superAdminReviewedAt": "2024-10-25T14:00:00Z"
}
```

---

## 4. Full Request Object Structure (GET /api/requests/:id)
When the frontend fetches application state (currently mocked in `RequestContext.jsx`), it expects the Request objects to look like this once fully processed:

```json
{
  "id": "REQ-2026-003",
  "dept": "Plumbing",
  "desc": "Leaking pipe in main restroom",
  "location": "Main Restroom 1st Floor",
  "date": "Feb 18, 2026", // Display formatting (or ISO string)
  "createdAt": "2026-02-18T14:20:00Z",
  "status": "APPROVED",
  "requesterName": "mike_smith",
  
  // Populated by Admin
  "adminRemarks": "Plumbing team available tomorrow.",
  "adminName": "admin_user",
  "adminReviewedAt": "2026-02-18T16:00:00Z",
  
  // Populated by Super Admin via Quotation Modal
  "quotationAmount": 5000.00,
  "quotationDescription": "Parts: Pipe (₹3500), Labor (₹1500)",
  "requiredDate": "2026-02-21",
  "superAdminRemarks": "Approved for execution.",
  "superAdminName": "super_admin_user",
  "superAdminReviewedAt": "2026-02-19T10:30:00Z"
}
```

### Note for the Backend Developer:
- The `RequestDetailsModal.jsx` uses the `adminReviewedAt` and `superAdminReviewedAt` fields to populate the UI timeline. If these are null, those steps show as pending/incomplete.
- The `QuotationAmount` and `RequiredDate` are heavily featured if the card is assigned the `APPROVED` status. Please ensure these fields are returned for approved requests to avoid empty UI states.
