import { Suspense } from "react";
import UpdatePassword from "./UpdatePassword";

function page() {
  return (
    <Suspense fallback={null}>
      <UpdatePassword />
    </Suspense>
  );
}

export default page;
