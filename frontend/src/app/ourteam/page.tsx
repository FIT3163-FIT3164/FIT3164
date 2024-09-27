import { FaLinkedinIn } from "react-icons/fa"; // Import LinkedIn icon

export default function Team() {
  const teamMembers = [
    {
      name: "Fawwad",
      role: "Project Manager",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQHFKVaj4j5XXg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709393625789?e=1731542400&v=beta&t=t0LoYfixDKFBveDlUaPRX7rkV5Lw3GWcqnOkT2XBeSQ",
      linkedin: "https://www.linkedin.com/in/mfak/", // Add actual LinkedIn URLs
    },
    {
      name: "Jiun Cheng",
      role: "Technical Lead",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQFqQcVRPCZ9Uw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1691316905249?e=1731542400&v=beta&t=VUEHHWG6IV7Ng_aqRUZyRassx9of0kkPgOZ6NqKdEQM",
      linkedin: "https://www.linkedin.com/in/jiun-cheng-yap-40a27a251/", // Add actual LinkedIn URLs
    },
    {
      name: "Manthi",
      role: "Quality Assurance",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQGIiP2RZLM1qQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1678323398710?e=1731542400&v=beta&t=8qDosG9is1DGBEdwB0QA-nPsq10zt3UblwYbkgcbSWo",
      linkedin: "https://www.linkedin.com/in/manthi-subasinghe-749116234/", // Add actual LinkedIn URLs
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 flex items-center justify-center py-2"> {/* Centering vertically and reducing top padding */}
      <div className="container mx-auto px-6 text-center">
        <h1 className="display-4 ls-tight">
          <span className="d-inline-flex bg-clip-text gradient-bottom-right start-blue-500 end-indigo-400 position-relative">
            Our Team
          </span>
        </h1>
        <p className="text-lg text-black-600 mb-12 max-w-2xl mx-auto">
          We strive to do everything so that you can comfortably and
          productively work in our space and create amazing products and
          services.
        </p>

        <div className="container mx-auto px-6 text-center max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-20"> {/* Adjusted for better centering and spacing */}
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 text-center transform transition hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center"
                style={{ width: "250px", height: "380px" }}
              >
                <img
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  className="rounded-full mb-6 w-36 h-36 object-cover border-8 border-gray-100 shadow-md"
                />
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-500 mb-4">{member.role}</p>
                <div className="flex justify-center space-x-4 mt-auto">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-pink-500 hover:text-pink-600"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
