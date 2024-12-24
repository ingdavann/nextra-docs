import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';

type Document = {
  uuid: string;
  documentCategoryName: string;
  title: string;
  description: string;
  createdAt: string;
  documentImages: string[];
};

type Section = {
  uuid: string;
  name: string;
  description: string;
  documents: Document[];
};

type SectionPageProps = {
  section: Section;
};

export default function SectionPage({ section }: SectionPageProps) {
  if (!section) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{section.name}</h1>
      <p>{section.description}</p>

      {section.documents && section.documents.length > 0 ? (
        <div>
          {section.documents.map((doc) => (
            <div key={doc.uuid} style={{ marginBottom: '2rem' }}>
              <h2>{doc.title}</h2>
              {/* Rendering HTML content */}
              <p dangerouslySetInnerHTML={{ __html: doc.description }}></p>
              {doc.documentImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={doc.title}
                  style={{ maxWidth: '100%', marginBottom: '1rem' }}
                />
              ))}
              <small>Created at: {new Date(doc.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      ) : (
        <p>No documents available in this section.</p>
      )}
    </div>
  );
}

// Fetch API data for dynamic paths
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('http://136.228.158.126:4011/api/v1/document-categories/details');
  const data = await res.json();

  const paths = data.data.map((section: Section) => ({
    params: { section: section.uuid },
  }));

  return { paths, fallback: false };
};

// Fetch section data for the page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { section } = params!;
  const res = await fetch(`http://136.228.158.126:4011/api/v1/document-categories/details/${section}`);
  const sectionData = await res.json();

  return { props: { section: sectionData } };
};
