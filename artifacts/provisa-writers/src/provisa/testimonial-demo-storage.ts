export type DemoTestimonial = {
  id: string;
  quote: string;
  image: string;
  attribution: string;
  demoImageKey?: string;
};

export const DEMO_TESTIMONIALS_STORAGE_KEY =
  "provisa-template-2-demo-testimonials";

const IMAGE_DATABASE = "provisa-template-demo";
const IMAGE_STORE = "testimonial-images";
const IMAGE_DATABASE_VERSION = 1;

type StoredTestimonial = Omit<DemoTestimonial, "image"> & {
  image: string;
};

function openImageDatabase(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(
      new Error("This browser does not support local demo image storage."),
    );
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(
      IMAGE_DATABASE,
      IMAGE_DATABASE_VERSION,
    );

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(IMAGE_STORE)) {
        database.createObjectStore(IMAGE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error("Could not open local demo image storage."),
      );
    request.onblocked = () =>
      reject(new Error("Local demo image storage is busy. Reload and retry."));
  });
}

async function readImage(key: string): Promise<Blob | null> {
  const database = await openImageDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(IMAGE_STORE, "readonly");
      const request = transaction.objectStore(IMAGE_STORE).get(key);
      request.onsuccess = () =>
        resolve(request.result instanceof Blob ? request.result : null);
      request.onerror = () =>
        reject(
          request.error ??
            new Error("Could not read a saved demo testimonial image."),
        );
      transaction.onabort = () =>
        reject(
          transaction.error ??
            new Error("Could not read a saved demo testimonial image."),
        );
    });
  } finally {
    database.close();
  }
}

export async function saveDemoTestimonialImage(
  file: File,
): Promise<{ key: string; previewUrl: string }> {
  const database = await openImageDatabase();
  const key = crypto.randomUUID();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(IMAGE_STORE, "readwrite");
      transaction.objectStore(IMAGE_STORE).put(file, key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(
          transaction.error ??
            new Error("Could not save the demo testimonial image."),
        );
      transaction.onabort = () =>
        reject(
          transaction.error ??
            new Error("Could not save the demo testimonial image."),
        );
    });
  } finally {
    database.close();
  }

  return { key, previewUrl: URL.createObjectURL(file) };
}

export async function readDemoTestimonials(): Promise<DemoTestimonial[]> {
  if (typeof window === "undefined") return [];

  const serialized = window.localStorage.getItem(
    DEMO_TESTIMONIALS_STORAGE_KEY,
  );
  if (!serialized) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error("Saved demo testimonials could not be read.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Saved demo testimonials have an invalid format.");
  }

  const records = parsed as StoredTestimonial[];
  return Promise.all(
    records.map(async (record) => {
      if (!record || typeof record.id !== "string") {
        throw new Error("A saved demo testimonial is invalid.");
      }
      if (!record.demoImageKey) return record;

      const image = await readImage(record.demoImageKey);
      return {
        ...record,
        image: image ? URL.createObjectURL(image) : "",
      };
    }),
  );
}

export async function writeDemoTestimonials(
  testimonials: DemoTestimonial[],
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Demo testimonials can only be saved in a browser.");
  }

  const stored = testimonials.map((testimonial) => ({
    ...testimonial,
    image: testimonial.demoImageKey ? "" : testimonial.image,
  }));

  try {
    window.localStorage.setItem(
      DEMO_TESTIMONIALS_STORAGE_KEY,
      JSON.stringify(stored),
    );
  } catch {
    throw new Error(
      "The browser could not save this demo testimonial. Check available storage and try again.",
    );
  }
}

export function releaseDemoTestimonialUrls(
  testimonials: DemoTestimonial[],
): void {
  for (const testimonial of testimonials) {
    if (testimonial.demoImageKey && testimonial.image.startsWith("blob:")) {
      URL.revokeObjectURL(testimonial.image);
    }
  }
}