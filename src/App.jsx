import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

const schema = Yup.object({
  cardholder: Yup.string()
    .trim()
    .min(2, "Enter the cardholder name.")
    .matches(
      /^[a-zA-Z][a-zA-Z .'-]*$/,
      "Use letters and common name punctuation only.",
    )
    .required("Cardholder name is required."),
  cardNumber: Yup.string()
    .required("Card number is required.")
    .test("luhn", "Enter a valid 13–19 digit card number.", (v) => {
      const d = (v || "").replace(/\s/g, "");
      if (!/^\d{13,19}$/.test(d)) return false;
      let s = 0,
        b = false;
      for (let i = d.length - 1; i >= 0; i--) {
        let n = +d[i];
        if (b) {
          n *= 2;
          if (n > 9) n -= 9;
        }
        s += n;
        b = !b;
      }
      return s % 10 === 0;
    }),
  expiry: Yup.string()
    .required("Expiry date is required.")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format.")
    .test("future", "This card has expired.", (v) => {
      if (!v || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(v)) return false;
      const [m, y] = v.split("/").map(Number);
      return new Date(2000 + y, m, 0, 23, 59, 59) >= new Date();
    }),
  cvv: Yup.string()
    .required("CVV is required.")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits."),
  billingName: Yup.string()
    .trim()
    .min(2, "Enter the billing name.")
    .required("Billing name is required."),
  address: Yup.string()
    .trim()
    .min(5, "Enter a complete street address.")
    .required("Street address is required."),
  city: Yup.string()
    .trim()
    .min(2, "Enter your city.")
    .required("City is required."),
  state: Yup.string()
    .trim()
    .min(2, "Enter your state.")
    .required("State is required."),
  pincode: Yup.string()
    .required("PIN code is required.")
    .matches(/^\d{6}$/, "Enter a valid 6-digit Indian PIN code."),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address.")
    .required("Email is required."),
  saveCard: Yup.boolean(),
});
const initial = {
  cardholder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  billingName: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  email: "",
  saveCard: false,
};
const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
const cardFormat = (v) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
const expFormat = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

function Input({
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  maxLength,
  inputMode,
}) {
  return (
    <Field name={name}>
      {({ field, meta }) => (
        <div className="field">
          <label htmlFor={name}>{label}</label>
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            maxLength={maxLength}
            inputMode={inputMode}
            aria-invalid={!!(meta.touched && meta.error)}
          />
          {meta.touched && meta.error && (
            <span className="error">{meta.error}</span>
          )}
        </div>
      )}
    </Field>
  );
}
export default function App() {
  const [success, setSuccess] = useState(false);
  return (
    <div className="app">
      <div className="announcement">
        <Truck size={14} /> Complimentary shipping on orders over ₹2,000
      </div>
      <header>
        <a className="logo" href="#top">
          shopnest<span>.</span>
        </a>
        <div className="steps">
          <span>✓ Cart</span>
          <b>02&nbsp; Payment</b>
          <span>03&nbsp; Confirmation</span>
        </div>
        <div className="secure">
          <LockKeyhole size={15} /> Secure checkout
        </div>
      </header>
      <main id="top">
        <div className="crumb">
          <a href="#cart">
            <ArrowLeft size={13} /> Back to cart
          </a>
          <span>/</span> Payment details
        </div>
        {success ? (
          <section className="success">
            <CheckCircle2 size={42} />
            <p className="eyebrow">DEMO CHECKOUT</p>
            <h1>
              Form validated<span>.</span>
            </h1>
            <p>
              Your details passed Yup validation. No payment was processed and
              no card details were transmitted.
            </p>
            <button className="primary" onClick={() => setSuccess(false)}>
              Back to payment form <ArrowRight size={16} />
            </button>
          </section>
        ) : (
          <>
            <div className="heading">
              <div>
                <p className="eyebrow">ALMOST YOURS</p>
                <h1>
                  Payment details<span>.</span>
                </h1>
                <p>Enter your details to complete your order securely.</p>
              </div>
              <div className="stamp">
                <ShieldCheck size={22} /> Safe & secure
                <br /> checkout
              </div>
            </div>
            <div className="layout">
              <section className="form-card">
                <Formik
                  initialValues={initial}
                  validationSchema={schema}
                  onSubmit={(values, { setSubmitting }) => {
                    setSuccess(true);
                    setSubmitting(false);
                  }}
                >
                  <Form noValidate>
                    <div className="section-title">
                      <span>01</span>
                      <div>
                        <h2>Card information</h2>
                        <p>
                          Use test data only. Never enter real card details.
                        </p>
                      </div>
                      <CreditCard size={21} />
                    </div>
                    <Input
                      name="cardholder"
                      label="Name on card"
                      placeholder="e.g. Harini Gokulnath"
                      autoComplete="cc-name"
                    />
                    <Field name="cardNumber">
                      {({ field, meta, form }) => (
                        <div className="field">
                          <label htmlFor="cardNumber">Card number</label>
                          <div className="icon-input">
                            <input
                              {...field}
                              id="cardNumber"
                              placeholder="4242 4242 4242 4242"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              maxLength={23}
                              aria-invalid={!!(meta.touched && meta.error)}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "cardNumber",
                                  cardFormat(e.target.value),
                                )
                              }
                            />
                            <CreditCard size={18} />
                          </div>
                          {meta.touched && meta.error && (
                            <span className="error">{meta.error}</span>
                          )}
                        </div>
                      )}
                    </Field>
                    <div className="two">
                      <Field name="expiry">
                        {({ field, meta, form }) => (
                          <div className="field">
                            <label htmlFor="expiry">Expiry date</label>
                            <input
                              {...field}
                              id="expiry"
                              placeholder="MM/YY"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              maxLength={5}
                              onChange={(e) =>
                                form.setFieldValue(
                                  "expiry",
                                  expFormat(e.target.value),
                                )
                              }
                            />
                            {meta.touched && meta.error && (
                              <span className="error">{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                      <Input
                        name="cvv"
                        label="CVV / CVC"
                        placeholder="123"
                        type="password"
                        autoComplete="cc-csc"
                        maxLength={4}
                        inputMode="numeric"
                      />
                    </div>
                    <div className="section-title second">
                      <span>02</span>
                      <div>
                        <h2>Billing address</h2>
                        <p>
                          Enter the address associated with your payment method.
                        </p>
                      </div>
                    </div>
                    <Input
                      name="billingName"
                      label="Full name"
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                    <Input
                      name="address"
                      label="Street address"
                      placeholder="Flat number, street"
                      autoComplete="street-address"
                    />
                    <div className="two">
                      <Input
                        name="city"
                        label="City"
                        placeholder="e.g. Chennai"
                        autoComplete="address-level2"
                      />
                      <Input
                        name="state"
                        label="State"
                        placeholder="e.g. Tamil Nadu"
                        autoComplete="address-level1"
                      />
                    </div>
                    <div className="two">
                      <Input
                        name="pincode"
                        label="PIN code"
                        placeholder="600001"
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="postal-code"
                      />
                      <Input
                        name="email"
                        label="Email for receipt"
                        placeholder="you@example.com"
                        type="email"
                        autoComplete="email"
                      />
                    </div>
                    <label className="check">
                      <Field type="checkbox" name="saveCard" /> Remember my
                      details for next time
                    </label>
                    <div className="actions">
                      <a href="#cart">
                        <ArrowLeft size={15} /> Return to cart
                      </a>
                      <button className="primary" type="submit">
                        Validate payment form <ArrowRight size={16} />
                      </button>
                    </div>
                    <p className="privacy">
                      <LockKeyhole size={13} /> Demo only — form data is not
                      sent to a payment provider.
                    </p>
                  </Form>
                </Formik>
              </section>
              <aside className="summary">
                <div className="summary-head">
                  <h2>Order summary</h2>
                  <span>
                    <ShoppingBag size={15} /> 2 items
                  </span>
                </div>
                <div className="product">
                  <img
                    src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=180&q=80"
                    alt="Canvas tote"
                  />
                  <div>
                    <b>Everyday Canvas Tote</b>
                    <small>Natural / One size</small>
                  </div>
                  <strong>{money(899)}</strong>
                </div>
                <div className="product">
                  <img
                    src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=180&q=80"
                    alt="Ceramic mug"
                  />
                  <div>
                    <b>Minimal Ceramic Mug</b>
                    <small>Warm white / 350 ml</small>
                  </div>
                  <strong>{money(499)}</strong>
                </div>
                <div className="lines">
                  <div>
                    <span>Subtotal</span>
                    <span>{money(1398)}</span>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <span className="free">FREE</span>
                  </div>
                  <div>
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>
                </div>
                <div className="total">
                  <span>Total due</span>
                  <div>
                    <strong>{money(1398)}</strong>
                    <small>INR</small>
                  </div>
                </div>
                <div className="delivery">
                  <Truck size={17} />
                  <div>
                    <b>Estimated delivery</b>
                    <small>3–5 business days</small>
                  </div>
                </div>
                <p className="guarantee">
                  <ShieldCheck size={16} /> Your information is protected with
                  secure checkout.
                </p>
              </aside>
            </div>
          </>
        )}
      </main>
      <footer>
        <a className="logo" href="#top">
          shopnest<span>.</span>
        </a>
        <p>Everyday things, thoughtfully chosen.</p>
        <span>© 2026 ShopNest</span>
      </footer>
    </div>
  );
}
