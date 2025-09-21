"use client";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, ArrowRightCircle, CheckCircle, CheckCircle2, CheckCircle2Icon, ChevronDown, LucideCheckCircle } from "lucide-react";
import Image from "next/image";

export default function Home() {

  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative top-[-80px]">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-teal-600 to-teal-700 flex flex-col px-6 lg:px-27">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {/* Background image */}
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('/mfq58686-tmx3g68.png')"}}></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex items-center justify-between px-6 lg:px-30 py-16 flex-1 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full justify-between items-center">
            {/* Left Content */}
            <div className="space-y-10 text-center lg:text-left lg:pr-8">
              <h1 className="text-3xl lg:text-3xl font-bold text-white leading-tight max-w-3xl">
                Uji Kelayakan dan Kepatutan (UKK)<br />
                Koperasi Desa Merah Putih
              </h1>
              
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-lg font-medium text-white">Apa itu UKK?</h2>
                <p className="text-xs font-thin lg:text-base text-white leading-relaxed text-justify">
                  UKK adalah ujian sederhana untuk memastikan pengurus dan pengawas
                  koperasi benar-benar jujur, bisa dipercaya, dan sanggup mengurus
                  koperasi dengan baik.
                  <br /><br />
                  Dengan UKK, koperasi bisa dijalankan dengan lebih aman, teratur, dan
                  bermanfaat bagi semua anggota.
                </p>
              </div>
              
              <div className="space-y-6">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-5">
                  <span>Cara Daftar UKK</span>
                  <ArrowRightCircle className="w-6 h-6" />
                </Button>
                <p className="text-sm text-white italic max-w-2xl">
                  * Isi data dan lengkapi dokumen sebelum ikut ujian.
                </p>
              </div>
            </div>
            
            {/* Right Content - Hero Image */}
            <div className="flex justify-center lg:justify-end lg:pl-8">
              <Image
                src="/mfq58686-wsfn91t.png"
                alt="Hero Image"
                width={829}
                height={550}
                className="w-full max-w-lg lg:max-w-2xl h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About UKK Section */}
      <section className="py-32 px-6 lg:px-27 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 mb-8">Tentang UKK</h2>
          <p className="text-lg text-slate-700 font-bold leading-relaxed text-justify mb-20 max-w-7xl">
            Melalui Uji Kelayakan dan Kepatutan (UKK), setiap calon pengurus dan
            pengawas koperasi Desa Merah Putih mendapatkan kesempatan untuk
            membuktikan kualitasnya. Proses ini bukan hanya formalitas, melainkan
            sebuah gerbang untuk memastikan koperasi dikelola secara profesional,
            akuntabel, dan sesuai regulasi.
          </p>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* FAQ Image */}
            <div className="flex-shrink-0">
              <Image
                src="/mfq58683-mq8awir.svg"
                alt="FAQ Illustration"
                width={427}
                height={382}
                className="w-80 lg:w-96 h-auto"
              />
            </div>
            
            {/* FAQ Content */}
            <div className="flex-1 space-y-20">
              {/* What is tested */}
              <div className="space-y-8">
                <h3 className="text-lg font-bold text-slate-700">Apa Saja yang Diuji?</h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-5 border border-slate-700 rounded-3xl">
                    <span className="text-lg font-bold text-slate-700">Dokumen Administrasi</span>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between p-5 border border-slate-700 rounded-3xl">
                    <span className="text-lg font-bold text-slate-700">Uji Kemampuan Kompetensi, Kreativitas, dan Inovasi</span>
                    <ChevronDown className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              {/* Results */}
              <div className="space-y-8">
                <h3 className="text-lg font-bold text-green-600">Apa Hasilnya?</h3>
                <div className="space-y-5">
                  <div className="bg-green-600 rounded-lg p-6">
                    <p className="text-sm text-white leading-relaxed">
                      Jika lulus, Anda akan mendapat sertifikat resmi sebagai bukti
                      bahwa Anda layak menjadi pengurus atau pengawas koperasi.
                    </p>
                  </div>
                  <div className="bg-green-600 rounded-lg p-6">
                    <p className="text-sm text-white leading-relaxed">
                      Jika belum lulus, masih ada kesempatan untuk mencoba lagi
                      setelah 1 bulan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 lg:px-30 bg-slate-700 min-h-[509px]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Benefits Content */}
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">Manfaat UKK</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
                <p className="text-lg font-bold text-white">
                  Koperasi lebih terpercaya dan sehat.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
                <p className="text-lg font-bold text-white">
                  Anggota merasa lebih tenang karena dikelola orang yang kompeten.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-white" />
                <p className="text-lg font-bold text-white">
                  Pengurus dan pengawas lebih paham aturan dan siap menghadapi
                  tantangan koperasi ke depan.
                </p>
              </div>
            </div>
          </div>
          
          {/* Benefits Illustration */}
          <div className="flex-shrink-0">
            <Image
              src="/mfq58683-txjd4uq.svg"
              alt="Online Money Transfer"
              width={400}
              height={300}
              className="w-80 lg:w-96 h-auto"
            />
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-32 px-6 lg:px-27 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-700 text-center mb-16">Bagaimana Cara Ikut UKK?</h2>
          
          {(() => {
            const steps = [
              {
                id: 1,
                icon: "/mfq58683-113d2b0.svg",
                alt: "Secure Login",
                title: "Daftar/Masuk Akun",
                description: (
                  <>
                    <span>Klik tombol </span>
                    <span className="font-bold">Masuk </span>
                    <span>di website untuk masuk akun.</span>
                  </>
                )
              },
              {
                id: 2,
                icon: "/mfq58683-89ksd4o.svg",
                alt: "Form",
                title: "Lengkapi Administrasi",
                description: "Anda harus melengkapi dokumen persyaratan administrasi, seperti KTP, SKCK, ijazah, dan dokumen lainnya."
              },
              {
                id: 3,
                icon: "/mfq58683-kqugubd.svg",
                alt: "Work From Home",
                title: "Ujian dan Wawancara",
                description: "Jika dokumen administasi lengkap dan valid, Anda bisa mengikuti ujian dan wawancara."
              },
              {
                id: 4,
                icon: "/mfq58683-34977iq.svg",
                alt: "Success",
                title: "Kelulusan",
                description: "Bagi pengurus/pengawas yang lulus akan mendapatkan sertifikat. Jika belum lulus, Anda diberi kesempatan mengajukan UKK kembali paling cepat 1 (satu) bulan."
              }
            ];

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-10 mb-16">
                {steps.map((step) => (
                  <div key={step.id} className="bg-[#EFF0F1] rounded-2xl p-8 text-center space-y-6">
                    <div className="relative inline-block">
                      <Image 
                        src={step.icon} 
                        alt={step.alt} 
                        width={300} 
                        height={300} 
                        className="mx-auto" 
                      />
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#065366] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{step.id}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}
          
          <div className="text-center space-y-8">
            <p className="text-lg text-slate-700 font-medium">
              Daftar sekarang, buktikan kelayakan Anda, dan majukan koperasi Desa
              Merah Putih
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-lg transition-colors">
              Daftar Seleksi UKK
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
