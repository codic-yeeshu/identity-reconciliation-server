# Contact Identity Service

A RESTful service that helps track and consolidate customer identities across multiple purchases based on their email and phone number information.

## Features

- Creates and manages customer identity records
- Links related contacts based on matching email or phone number
- Maintains primary/secondary contact relationships
- Consolidates contact information in responses
- Handles various edge cases and data scenarios

## API Documentation

### Identify Contact Endpoint

**URL**: `/identify`
**Method**: `POST`
**Content-Type**: `application/json`

#### Request Body Schema

```typescript
{
  email?: string,
  phoneNumber?: string | number
}
```

#### Success Response

```typescript
{
  "contact": {
    "primaryContatctId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

#### Error Responses

- `400 Bad Request`: When neither email nor phoneNumber is provided
- `500 Internal Server Error`: When server encounters an error

## Business Rules

1. **Primary Contact**

   - The oldest contact is always treated as primary
   - A contact can change from primary to secondary when linked to an older contact

2. **Secondary Contacts**

   - Created when new information is provided for an existing contact
   - Always linked to a primary contact through `linkedId`

3. **Contact Linking**
   - Contacts are linked if they share either email or phone number
   - All linked contacts form a single identity group

## Database Schema

```prisma
model User {
  id              Int      @id @default(autoincrement())
  phoneNumber     String?
  email           String?
  linkedId        Int?
  linkPrecedence  String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?
}
```

## Usage Examples

See the `api.rest` file for detailed examples of different scenarios.
