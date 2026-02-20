# Request Management Workflow API

## Overview

This API implements a multi-stage request approval workflow where:
1. **Requester** creates a maintenance request
2. **Admin** reviews and sets the required completion date
3. **Super Admin** provides quotation and approves for work to begin

---

## Request Status Flow

```
SUBMITTED 
    ↓ (Admin approves after review)
PENDING_SA_APPROVAL (Pending Super Admin)
    ↓ (Super Admin approves with quotation)
APPROVED
    ↓ (Work begins)
IN_PROCUREMENT / IN_PRODUCTION
    ↓ (Work completes)
READY_FOR_COLLECTION / COMPLETED
```

---

## API Endpoints

### 1. REQUESTER ENDPOINTS (`/api/request`)

#### 1.1 Create a New Request
**Endpoint:** `POST /api/request`

**Authentication:** Required (REQUESTER role)

**Request Body:**
```json
{
  "mobileNumber": "9876543210",
  "itemDescription": "Fix the broken air conditioner in Conference Room A",
  "serviceDepartmentName": "Electrical",
  "urgencyRequested": false,
  "urgencyReason": null,
  "requiredDate": null
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "requestNumber": "REQ-2026-12345",
  "mobileNumber": "9876543210",
  "itemDescription": "Fix the broken air conditioner in Conference Room A",
  "requiredDate": null,
  "status": "SUBMITTED",
  "urgencyRequested": false,
  "urgencyReason": null,
  "requesterName": "john_doe",
  "organizationDepartmentName": "Jivadaya",
  "serviceDepartmentName": "Electrical",
  "adminRemarks": null,
  "adminName": null,
  "adminReviewedAt": null,
  "quotationAmount": null,
  "quotationDescription": null,
  "superAdminRemarks": null,
  "superAdminName": null,
  "superAdminReviewedAt": null,
  "createdAt": "2026-02-20T10:30:00Z"
}
```

---

#### 1.2 Get All My Requests
**Endpoint:** `GET /api/request/my`

**Authentication:** Required (REQUESTER role)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "requestNumber": "REQ-2026-12345",
    "mobileNumber": "9876543210",
    "itemDescription": "Fix the broken air conditioner in Conference Room A",
    "requiredDate": "2026-03-15T18:00:00Z",
    "status": "PENDING_SA_APPROVAL",
    "urgencyRequested": false,
    "urgencyReason": null,
    "requesterName": "john_doe",
    "organizationDepartmentName": "Jivadaya",
    "serviceDepartmentName": "Electrical",
    "adminRemarks": "Feasible to complete. Electrical team available.",
    "adminName": "admin_user",
    "adminReviewedAt": "2026-02-21T11:00:00Z",
    "quotationAmount": null,
    "quotationDescription": null,
    "superAdminRemarks": null,
    "superAdminName": null,
    "superAdminReviewedAt": null,
    "createdAt": "2026-02-20T10:30:00Z"
  }
]
```

---

#### 1.3 Get Specific Request Details
**Endpoint:** `GET /api/request/{id}`

**Authentication:** Required (REQUESTER role)

**Path Parameters:**
- `id` (Long) - Request ID

**Response (200 OK):** Same as above for a single request

---

### 2. ADMIN ENDPOINTS (`/api/admin`)

#### 2.1 Get All Requests Pending Admin Review
**Endpoint:** `GET /api/admin/requests/pending-review`

**Authentication:** Required (ADMIN role)

**Description:** Returns all SUBMITTED requests waiting for admin examination and date setting

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "requestNumber": "REQ-2026-12345",
    "mobileNumber": "9876543210",
    "itemDescription": "Fix the broken air conditioner in Conference Room A",
    "requiredDate": null,
    "status": "SUBMITTED",
    "urgencyRequested": false,
    "urgencyReason": null,
    "requesterName": "john_doe",
    "organizationDepartmentName": "Jivadaya",
    "serviceDepartmentName": "Electrical",
    "adminRemarks": null,
    "adminName": null,
    "adminReviewedAt": null,
    "quotationAmount": null,
    "quotationDescription": null,
    "superAdminRemarks": null,
    "superAdminName": null,
    "superAdminReviewedAt": null,
    "createdAt": "2026-02-20T10:30:00Z"
  }
]
```

---

#### 2.2 Review Request and Set Required Date
**Endpoint:** `PUT /api/admin/requests/review`

**Authentication:** Required (ADMIN role)

**Request Body:**
```json
{
  "requestId": 1,
  "requiredDate": "2026-03-15T18:00:00Z",
  "adminRemarks": "Feasible to complete. Electrical team available on this date.",
  "approved": true
}
```

**Path Parameters:**
- `requestId` (Long) - The request ID to review

**Response (200 OK):**
```json
{
  "id": 1,
  "requestNumber": "REQ-2026-12345",
  "mobileNumber": "9876543210",
  "itemDescription": "Fix the broken air conditioner in Conference Room A",
  "requiredDate": "2026-03-15T18:00:00Z",
  "status": "PENDING_SA_APPROVAL",
  "urgencyRequested": false,
  "urgencyReason": null,
  "requesterName": "john_doe",
  "organizationDepartmentName": "Jivadaya",
  "serviceDepartmentName": "Electrical",
  "adminRemarks": "Feasible to complete. Electrical team available on this date.",
  "adminName": "admin_user",
  "adminReviewedAt": "2026-02-21T11:00:00Z",
  "quotationAmount": null,
  "quotationDescription": null,
  "superAdminRemarks": null,
  "superAdminName": null,
  "superAdminReviewedAt": null,
  "createdAt": "2026-02-20T10:30:00Z"
}
```

**Admin Review Request Fields:**
- `requestId` (Long, Required) - ID of the request to review
- `requiredDate` (Instant, Required) - Date by which the work should be completed
- `adminRemarks` (String, Required) - Admin's examination notes and feasibility assessment
- `approved` (Boolean) - true = move to Super Admin review, false = send back to requester

---

### 3. SUPER ADMIN ENDPOINTS (`/api/super-admin`)

#### 3.1 Get All Requests Pending Super Admin Review
**Endpoint:** `GET /api/super-admin/requests/pending-review`

**Authentication:** Required (SUPER_ADMIN role)

**Description:** Returns all PENDING_SA_APPROVAL requests waiting for quotation and final approval

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "requestNumber": "REQ-2026-12345",
    "mobileNumber": "9876543210",
    "itemDescription": "Fix the broken air conditioner in Conference Room A",
    "requiredDate": "2026-03-15T18:00:00Z",
    "status": "PENDING_SA_APPROVAL",
    "urgencyRequested": false,
    "urgencyReason": null,
    "requesterName": "john_doe",
    "organizationDepartmentName": "Jivadaya",
    "serviceDepartmentName": "Electrical",
    "adminRemarks": "Feasible to complete. Electrical team available on this date.",
    "adminName": "admin_user",
    "adminReviewedAt": "2026-02-21T11:00:00Z",
    "quotationAmount": null,
    "quotationDescription": null,
    "superAdminRemarks": null,
    "superAdminName": null,
    "superAdminReviewedAt": null,
    "createdAt": "2026-02-20T10:30:00Z"
  }
]
```

---

#### 3.2 Review Request and Send Quotation
**Endpoint:** `PUT /api/super-admin/requests/review`

**Authentication:** Required (SUPER_ADMIN role)

**Request Body:**
```json
{
  "requestId": 1,
  "quotationAmount": 5000.00,
  "quotationDescription": "Parts: AC compressor (₹3500), Labor charges (₹1500)",
  "superAdminRemarks": "Approved for execution. Standard maintenance work. Parts available in stock.",
  "approved": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "requestNumber": "REQ-2026-12345",
  "mobileNumber": "9876543210",
  "itemDescription": "Fix the broken air conditioner in Conference Room A",
  "requiredDate": "2026-03-15T18:00:00Z",
  "status": "APPROVED",
  "urgencyRequested": false,
  "urgencyReason": null,
  "requesterName": "john_doe",
  "organizationDepartmentName": "Jivadaya",
  "serviceDepartmentName": "Electrical",
  "adminRemarks": "Feasible to complete. Electrical team available on this date.",
  "adminName": "admin_user",
  "adminReviewedAt": "2026-02-21T11:00:00Z",
  "quotationAmount": 5000.00,
  "quotationDescription": "Parts: AC compressor (₹3500), Labor charges (₹1500)",
  "superAdminRemarks": "Approved for execution. Standard maintenance work. Parts available in stock.",
  "superAdminName": "super_admin_user",
  "superAdminReviewedAt": "2026-02-22T14:30:00Z",
  "createdAt": "2026-02-20T10:30:00Z"
}
```

**Super Admin Review Request Fields:**
- `requestId` (Long, Required) - ID of the request to review
- `quotationAmount` (Double, Required) - Estimated cost for the maintenance work
- `quotationDescription` (String, Required) - Itemized breakdown of costs (parts, labor, etc.)
- `superAdminRemarks` (String, Required) - Super Admin's approval notes and comments
- `approved` (Boolean) - true = move to APPROVED (work can begin), false = keep in SA_APPROVAL for revision

---

## Key Features

### Auto-Population
- **Requester**: Auto-populated from logged-in user
- **Organization Department**: Auto-populated from requester's profile
- **Admin/Super Admin Names**: Auto-captured from JWT principal when they review

### Status Transitions
- **SUBMITTED** → Only Admin can change to PENDING_SA_APPROVAL
- **PENDING_SA_APPROVAL** → Only Super Admin can change to APPROVED
- **APPROVED** → Ready for work to begin

### Access Control
- Requesters can only view their own requests
- Admins can only review SUBMITTED requests
- Super Admins can only review PENDING_SA_APPROVAL requests

### Data Integrity
- Each review step records the reviewer's name and timestamp
- Required dates are set by Admin
- Quotation details are provided by Super Admin
- All changes are immutable and audited

---

## Database Schema Changes

Run these migrations to add the new columns to the requests table:

```sql
-- Admin Review Fields
ALTER TABLE requests ADD COLUMN admin_remarks TEXT NULL;
ALTER TABLE requests ADD COLUMN reviewed_by_admin_id BIGINT NULL;
ALTER TABLE requests ADD COLUMN admin_reviewed_at TIMESTAMP NULL;
ALTER TABLE requests ADD FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(id);

-- Super Admin & Quotation Fields
ALTER TABLE requests ADD COLUMN quotation_amount DECIMAL(10, 2) NULL;
ALTER TABLE requests ADD COLUMN quotation_description TEXT NULL;
ALTER TABLE requests ADD COLUMN super_admin_remarks TEXT NULL;
ALTER TABLE requests ADD COLUMN reviewed_by_super_admin_id BIGINT NULL;
ALTER TABLE requests ADD COLUMN super_admin_reviewed_at TIMESTAMP NULL;
ALTER TABLE requests ADD FOREIGN KEY (reviewed_by_super_admin_id) REFERENCES users(id);
```

---

## Example Workflow Flow

### Step 1: Requester Creates Request
```
POST /api/request
→ Status: SUBMITTED
→ Waiting for Admin Review
```

### Step 2: Admin Reviews and Sets Date
```
PUT /api/admin/requests/review
{
  "requestId": 1,
  "requiredDate": "2026-03-15T18:00:00Z",
  "adminRemarks": "Feasible",
  "approved": true
}
→ Status: PENDING_SA_APPROVAL
→ Waiting for Super Admin Review
```

### Step 3: Super Admin Reviews and Sends Quotation
```
PUT /api/super-admin/requests/review
{
  "requestId": 1,
  "quotationAmount": 5000.00,
  "quotationDescription": "Parts & Labor",
  "superAdminRemarks": "Approved",
  "approved": true
}
→ Status: APPROVED
→ Ready for Work to Begin
```

### Step 4: Requester Monitors Progress
```
GET /api/request/1
→ Returns full request with all admin and super admin details
→ Includes quotation amount and description
→ Can see required date and admin remarks
```

---

## Error Handling

### Common Errors

**400 Bad Request**
- Missing required fields
- Invalid data format
- Amount not positive (for quotations)

**403 Forbidden**
- User lacks required role (ADMIN, SUPER_ADMIN, etc.)

**404 Not Found**
- Request ID doesn't exist
- User doesn't have access to request

**409 Conflict**
- Request is not in the correct status for the operation
- Example: Admin trying to review a request that's already PENDING_SA_APPROVAL

---

## Role-Based Access

| Endpoint | REQUESTER | ADMIN | SUPER_ADMIN |
|----------|-----------|-------|------------|
| POST /api/request | ✅ | ✗ | ✗ |
| GET /api/request/my | ✅ | ✗ | ✗ |
| GET /api/request/{id} | ✅ (own) | ✗ | ✗ |
| GET /api/admin/requests/pending-review | ✗ | ✅ | ✗ |
| PUT /api/admin/requests/review | ✗ | ✅ | ✗ |
| GET /api/super-admin/requests/pending-review | ✗ | ✗ | ✅ |
| PUT /api/super-admin/requests/review | ✗ | ✗ | ✅ |

---

## Notes

- All timestamps are in ISO 8601 format with UTC timezone
- Quotation amounts are in the currency used by the organization (e.g., INR)
- Admin remarks and super admin remarks are kept for audit trail and transparency
- Requesters receive the full details including quotation when super admin approves

