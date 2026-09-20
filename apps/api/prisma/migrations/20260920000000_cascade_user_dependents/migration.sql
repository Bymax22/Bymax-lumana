-- Allow a user and all required user-owned records to be removed safely.
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PasswordReset" DROP CONSTRAINT "PasswordReset_userId_fkey";
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Auction" DROP CONSTRAINT "Auction_sellerId_fkey";
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bid" DROP CONSTRAINT "Bid_bidderId_fkey";
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bid" DROP CONSTRAINT "Bid_auctionId_fkey";
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "FinanceApplication" DROP CONSTRAINT "FinanceApplication_userId_fkey";
ALTER TABLE "FinanceApplication" ADD CONSTRAINT "FinanceApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InspectionReport" DROP CONSTRAINT "InspectionReport_inspectorId_fkey";
ALTER TABLE "InspectionReport" ADD CONSTRAINT "InspectionReport_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RentalBooking" DROP CONSTRAINT "RentalBooking_userId_fkey";
ALTER TABLE "RentalBooking" ADD CONSTRAINT "RentalBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_userId_fkey";
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SupportMessage" DROP CONSTRAINT "SupportMessage_ticketId_fkey";
ALTER TABLE "SupportMessage" ADD CONSTRAINT "SupportMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
