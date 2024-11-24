import { prisma } from "../config/db.js";

export const identifyUserController = async (req, res) => {
  const { email, phoneNumber } = req.body;
  try {
    // Input validation
    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Either email or phoneNumber is required" });
    }

    // Find existing contacts with matching email or phone
    const existingContacts = await prisma.user.findMany({
      where: {
        OR: [
          { email: email || null },
          { phoneNumber: phoneNumber?.toString() || null },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // If no existing contacts, create a new primary contact
    if (existingContacts.length === 0) {
      const newContact = await prisma.user.create({
        data: {
          email,
          phoneNumber: phoneNumber?.toString(),
          linkPrecedence: "primary",
        },
      });

      return res.status(200).json({
        contact: {
          primaryContatctId: newContact.id,
          emails: [newContact.email].filter((email) => email != undefined),
          phoneNumbers: [newContact.phoneNumber].filter(
            (phone) => phone != undefined
          ),
          secondaryContactIds: [],
        },
      });
    }

    let primaryContact = existingContacts.find(
      (contact) => contact.linkPrecedence === "primary"
    );

    // Create new secondary contact
    await prisma.user.create({
      data: {
        email,
        phoneNumber: phoneNumber?.toString(),
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      },
    });

    // Update any primary contacts to be secondary if they're not the oldest
    const contactsToUpdate = existingContacts.filter(
      (contact) =>
        contact.id !== primaryContact.id && contact.linkPrecedence === "primary"
    );

    if (contactsToUpdate.length > 0) {
      await prisma.user.updateMany({
        where: {
          id: {
            in: contactsToUpdate.map((c) => c.id),
          },
        },
        data: {
          linkPrecedence: "secondary",
          linkedId: primaryContact.id,
        },
      });
    }

    // Get all related contacts after updates
    const allRelatedContacts = await prisma.user.findMany({
      where: {
        OR: [{ id: primaryContact.id }, { linkedId: primaryContact.id }],
      },
    });

    // Prepare response
    const responseData = {
      contact: {
        primaryContatctId: primaryContact.id,
        emails: allRelatedContacts
          .map((contact) => contact.email)
          .filter((email) => email != undefined),
        phoneNumbers: allRelatedContacts
          .map((contact) => contact.phoneNumber)
          .filter((phone) => phone != undefined),
        secondaryContactIds: allRelatedContacts
          .filter((contact) => contact.id !== primaryContact.id)
          .map((contact) => contact.id),
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error in identifyUserController:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// just for testing purpose
export const identifyUserControllerGet = (req, res) => {
  res.send("receiving requests");
};
