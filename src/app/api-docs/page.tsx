import SwaggerUI from "./SwaggerUI";

export const metadata = { title: "HanaLoop API Docs" };

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SwaggerUI />
    </div>
  );
}
