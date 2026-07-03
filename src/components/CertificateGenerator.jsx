import React, { useState } from 'react';
import { Certificate, Download, Copy, Check, AlertCircle, Key, Calendar } from 'lucide-react';

const CertificateGenerator = () => {
  const [formData, setFormData] = useState({
    userName: '',
    courseTitle: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    certificateId: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    skillsEarned: [],
    skillInput: ''
  });

  const [generatedCertificate, setGeneratedCertificate] = useState(null);
  const [copied, setCopied] = useState(false);

  const courseOptions = [
    { id: 1, title: 'SOC Analyst Fundamentals', skills: ['SIEM Analysis', 'Threat Detection', 'Log Management'] },
    { id: 2, title: 'Incident Response Mastery', skills: ['IR Planning', 'Containment', 'Forensics', 'Recovery'] },
    { id: 3, title: 'Threat Hunting Essentials', skills: ['Hunt Methodology', 'IOC Analysis', 'MITRE ATT&CK', 'Behavioral Analysis'] },
    { id: 4, title: 'Network Security Analysis', skills: ['Packet Analysis', 'Wireshark', 'Network Forensics', 'Protocol Analysis'] },
    { id: 5, title: 'Windows Security Hardening', skills: ['Event Log Analysis', 'Registry Analysis', 'Security Baselines', 'GPO Management'] },
    { id: 6, title: 'Detection Engineering', skills: ['Rule Writing', 'Sigma Rules', 'Yara Rules', 'Logic Development'] }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseSelect = (course) => {
    setFormData(prev => ({
      ...prev,
      courseTitle: course.title,
      skillsEarned: course.skills
    }));
  };

  const addSkill = () => {
    if (formData.skillInput.trim() && !formData.skillsEarned.includes(formData.skillInput)) {
      setFormData(prev => ({
        ...prev,
        skillsEarned: [...prev.skillsEarned, formData.skillInput],
        skillInput: ''
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillsEarned: prev.skillsEarned.filter(s => s !== skill)
    }));
  };

  const generateCertificate = () => {
    if (!formData.userName || !formData.courseTitle) {
      alert('Please fill in Name and Course Title');
      return;
    }

    const certificate = {
      id: formData.certificateId,
      name: formData.userName,
      course: formData.courseTitle,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      skills: formData.skillsEarned,
      generatedAt: new Date().toISOString(),
      signatureCode: `SIG-${Math.random().toString(36).substr(2, 12).toUpperCase()}`
    };

    setGeneratedCertificate(certificate);
  };

  const downloadCertificatePNG = () => {
    if (!generatedCertificate) return;

    const canvas = document.getElementById('certificate-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `certificate_${generatedCertificate.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadCertificateJSON = () => {
    if (!generatedCertificate) return;

    const jsonString = JSON.stringify(generatedCertificate, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate_${generatedCertificate.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCertificatePDF = () => {
    if (!generatedCertificate) return;

    const pdfContent = `
CERTIFICATE OF ACHIEVEMENT
====================================

This is to certify that

${generatedCertificate.name.toUpperCase()}

has successfully completed the course

${generatedCertificate.course}

and demonstrated proficiency in the following skills:

${generatedCertificate.skills.map(skill => `  • ${skill}`).join('\n')}

Certificate ID: ${generatedCertificate.id}
Issue Date: ${generatedCertificate.issueDate}
${generatedCertificate.expiryDate ? `Expiry Date: ${generatedCertificate.expiryDate}` : 'Non-Expiring Certificate'}
Signature Code: ${generatedCertificate.signatureCode}

Generated on: ${new Date(generatedCertificate.generatedAt).toLocaleString()}

This certificate is issued by SOC Learning Platform
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate_${generatedCertificate.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyCertificateData = () => {
    const text = `Certificate ID: ${generatedCertificate.id}\nName: ${generatedCertificate.name}\nCourse: ${generatedCertificate.course}\nSkills: ${generatedCertificate.skills.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Certificate className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Certificate Generator
            </h1>
          </div>
          <p className="text-gray-400">Create and download professional achievement certificates for completed courses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-100">Certificate Details</h2>

              {/* User Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    placeholder="Enter recipient name"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">Select Course *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {courseOptions.map(course => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseSelect(course)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                          formData.courseTitle === course.title
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        {course.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Issue Date *</label>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Skills Earned</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={formData.skillInput}
                      onChange={(e) => setFormData(prev => ({ ...prev, skillInput: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      placeholder="Add a skill and press Enter"
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={addSkill}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.skillsEarned.map((skill, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-blue-100 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificate ID */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Certificate ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.certificateId}
                      readOnly
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-gray-100 cursor-not-allowed"
                    />
                    <button
                      onClick={() => {
                        const newId = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                        setFormData(prev => ({ ...prev, certificateId: newId }));
                      }}
                      className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateCertificate}
                  className="w-full py-3 px-4 rounded-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all text-white"
                >
                  Generate Certificate
                </button>
              </div>
            </div>
          </div>

          {/* Preview/Info Section */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-100">Generator Features</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Professional certificate design</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Unique certificate IDs</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Multiple export formats</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Skills tracking</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Optional expiration dates</span>
              </li>
              <li className="flex gap-3">
                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Signature codes for verification</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="font-bold text-gray-100 mb-3">Export Formats</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <p>• PNG Image</p>
                <p>• JSON Data</p>
                <p>• TXT Document</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Certificate Display */}
        {generatedCertificate && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Generated Certificate</h2>

            {/* Certificate Preview Canvas */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-6">
              <div
                id="certificate-canvas"
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-12 text-center border-8 border-amber-700 shadow-2xl"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  minHeight: '600px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h1 className="text-4xl font-bold text-amber-900 mb-2">CERTIFICATE</h1>
                  <p className="text-amber-800 font-semibold">of Achievement</p>
                </div>

                <div>
                  <p className="text-sm text-amber-900 mb-2">This is proudly presented to</p>
                  <p className="text-4xl font-bold text-amber-900 border-b-4 border-amber-900 pb-4 mb-4">
                    {generatedCertificate.name}
                  </p>
                  <p className="text-sm text-amber-900 mb-1">for successfully completing</p>
                  <p className="text-2xl font-bold text-amber-900">{generatedCertificate.course}</p>
                </div>

                <div className="text-sm text-amber-900">
                  <p className="mb-2">Skills Earned:</p>
                  <p className="font-semibold">{generatedCertificate.skills.join(' • ')}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs text-amber-900">
                  <div>
                    <p className="font-semibold">Certificate ID</p>
                    <p>{generatedCertificate.id}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Issue Date</p>
                    <p>{generatedCertificate.issueDate}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Verification</p>
                    <p>{generatedCertificate.signatureCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Details & Download Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Certificate Info */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-100">Certificate Information</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-400">Recipient Name</p>
                    <p className="text-gray-100 font-medium">{generatedCertificate.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Course Title</p>
                    <p className="text-gray-100 font-medium">{generatedCertificate.course}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Certificate ID</p>
                    <p className="text-gray-100 font-medium break-all">{generatedCertificate.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Issue Date</p>
                    <p className="text-gray-100 font-medium">{generatedCertificate.issueDate}</p>
                  </div>
                  {generatedCertificate.expiryDate && (
                    <div>
                      <p className="text-gray-400">Expiry Date</p>
                      <p className="text-gray-100 font-medium">{generatedCertificate.expiryDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400">Skills Earned</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {generatedCertificate.skills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={copyCertificateData}
                  className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    copied
                      ? 'bg-green-700 text-green-200'
                      : 'bg-slate-700 hover:bg-slate-600 text-gray-200'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Certificate Data
                    </>
                  )}
                </button>
              </div>

              {/* Download Options */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-100">Download Certificate</h3>
                <div className="space-y-3">
                  <button
                    onClick={downloadCertificatePNG}
                    className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-600 px-4 py-3 rounded-lg font-medium transition-colors text-white"
                  >
                    <Download className="w-4 h-4" />
                    Download as PNG Image
                  </button>
                  <button
                    onClick={downloadCertificateJSON}
                    className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-600 px-4 py-3 rounded-lg font-medium transition-colors text-white"
                  >
                    <Download className="w-4 h-4" />
                    Download as JSON
                  </button>
                  <button
                    onClick={downloadCertificatePDF}
                    className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 px-4 py-3 rounded-lg font-medium transition-colors text-white"
                  >
                    <Download className="w-4 h-4" />
                    Download as TXT Document
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <p className="text-xs text-blue-300 font-medium">Share & Verify</p>
                  </div>
                  <p className="text-xs text-blue-200">
                    Share the Certificate ID and Signature Code to allow others to verify this certificate's authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateGenerator;
