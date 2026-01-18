export default function ContactPage() {
  return (
    <div className="px-10 py-20 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Contact Us
      </h1>

      <p className="text-gray-600 mb-8">
        Have questions? Reach out to us.
      </p>

      <div className="space-y-4">
        <div>
          <span className="font-medium">Email:</span>{" "}
          support@ecommerce.com
        </div>

        <div>
          <span className="font-medium">Phone:</span>{" "}
          +91 9876543210
        </div>

        <div>
          <span className="font-medium">Location:</span>{" "}
          India
        </div>
      </div>
    </div>
  );
}
