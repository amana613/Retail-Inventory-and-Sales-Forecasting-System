import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const loadPayments = async () => {
      const response = await api.get("/payments");
      setPayments(response.data);
    };

    loadPayments();
  }, []);

  return (
    <section className="section-stack">
      <header className="page-header">
        <h2>Payments</h2>
        <p>Review simulated payment records.</p>
      </header>
      <div className="grid">
        {payments.map((payment) => (
          <article className="card" key={payment._id}>
            <p><span className="label">Order</span> {payment.order_id?._id}</p>
            <p className="metric">${payment.amount}</p>
            <p><span className="label">Method</span> {payment.method}</p>
            <p><span className="label">Status</span> {payment.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminPaymentsPage;
