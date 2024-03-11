## Mini-Loan App

The Mini-Loan App is a web application that facilitates the loan application process for authenticated users. Users can submit loan requests, view their own loans, and make repayments. Admins have the authority to approve or reject loan applications.

### Features

1. **Loan Application:**
   - Authenticated users can submit loan requests specifying the amount required and the loan term.
   - Loan terms are assumed to have a weekly repayment frequency.

2. **Loan Approval:**
   - Admins can review and approve pending loan applications.

3. **View Loans:**
   - Users can view their own loans only. A policy check ensures users can access their own loan details.

4. **Loan Repayments:**
   - Users can make repayments for their loans.
   - Repayments mark the scheduled repayment as PAID.
   - When all scheduled repayments for a loan are PAID, the loan status changes to PAID automatically.

### Actions

1. **Customer Loan Creation:**
   - Users can create a loan by submitting a loan request with the amount and term.
   - Scheduled repayments are generated based on the loan term.

2. **Admin Loan Approval:**
   - Admins can change the status of pending loans to APPROVED.

3. **View User Loans:**
   - Implement a policy check to restrict users to view only their own loans.

4. **Loan Repayment Submission:**
   - Users can submit repayments with an amount equal to or greater than the scheduled repayment.
   - Repayments update the status of the scheduled repayment to PAID.
   - If all scheduled repayments for a loan are PAID, the loan status changes to PAID.

### Default Credentials
- **Admin:** 
  - Username: admin
  - Password: admin

### Getting Started
1. Sign up to create your user account.
2. Log in using your username and password.
3. Admins can log in using the default admin credentials mentioned above.

