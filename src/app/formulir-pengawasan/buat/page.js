'use client';

import { api } from '@/lib/client';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  DatePicker,
  List,
  Radio,
  Slider,
  Spin,
  Steps,
  Upload,
  Space,
  Divider,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';

const BuatFormulirPengawasan = () => {
  const [inspections, setInspections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [temuanList, setTemuanList] = useState({});
  const [rekomendasiList, setRekomendasiList] = useState({});

  const getMasterDataInspections = async () => {
    const res = await api.get('/inspections/master-data');
    setInspections(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getMasterDataInspections();
  }, []);

  const formStepper = inspections.map((inspection) => ({
    title: (
      <div className="text-primary text-sm font-semibold">
        {inspection.name}
      </div>
    ),
  }));

  const radioOptions = [
    { label: 'Tidak Sesuai', value: 'tidak_sesuai' },
    { label: 'Cukup', value: 'cukup' },
    { label: 'Sesuai', value: 'sesuai' },
  ];

  // CRUD functions for Temuan
  const addTemuan = (inspectionId) => {
    const newId = Date.now();
    setTemuanList((prev) => ({
      ...prev,
      [inspectionId]: [
        ...(prev[inspectionId] || []),
        {
          id: newId,
          name: '',
          description: '',
        },
      ],
    }));
  };

  const updateTemuan = (inspectionId, temuanId, field, value) => {
    setTemuanList((prev) => ({
      ...prev,
      [inspectionId]:
        prev[inspectionId]?.map((temuan) =>
          temuan.id === temuanId ? { ...temuan, [field]: value } : temuan
        ) || [],
    }));
  };

  const deleteTemuan = (inspectionId, temuanId) => {
    setTemuanList((prev) => ({
      ...prev,
      [inspectionId]:
        prev[inspectionId]?.filter((temuan) => temuan.id !== temuanId) || [],
    }));
    // Also delete related rekomendasi
    setRekomendasiList((prev) => ({
      ...prev,
      [temuanId]: undefined,
    }));
  };

  // CRUD functions for Rekomendasi
  const addRekomendasi = (temuanId) => {
    const newId = Date.now();
    setRekomendasiList((prev) => ({
      ...prev,
      [temuanId]: [
        ...(prev[temuanId] || []),
        {
          id: newId,
          pihakBertanggungJawab: '',
          batasWaktuImplementasi: null,
          rencanaMonitoring: '',
        },
      ],
    }));
  };

  const updateRekomendasi = (temuanId, rekomendasiId, field, value) => {
    setRekomendasiList((prev) => ({
      ...prev,
      [temuanId]:
        prev[temuanId]?.map((rekomendasi) =>
          rekomendasi.id === rekomendasiId
            ? { ...rekomendasi, [field]: value }
            : rekomendasi
        ) || [],
    }));
  };

  const deleteRekomendasi = (temuanId, rekomendasiId) => {
    setRekomendasiList((prev) => ({
      ...prev,
      [temuanId]:
        prev[temuanId]?.filter(
          (rekomendasi) => rekomendasi.id !== rekomendasiId
        ) || [],
    }));
  };

  const handleNext = async () => {
    try {
      // Validate current step fields before proceeding
      const currentInspection = inspections[currentStep];
      const fieldsToValidate =
        currentInspection?.inspection_area_details?.map(
          (detail) =>
            `inspection_${currentInspection.uuid}_detail_${detail.uuid}`
        ) || [];

      await form.validateFields(fieldsToValidate);

      // Validate temuan and rekomendasi data
      const currentTemuan = temuanList[currentInspection.id] || [];
      for (const temuan of currentTemuan) {
        if (!temuan.name.trim()) {
          throw new Error('Nama temuan harus diisi');
        }
        if (!temuan.description.trim()) {
          throw new Error('Deskripsi temuan harus diisi');
        }

        const rekomendasi = rekomendasiList[temuan.id] || [];
        for (const rek of rekomendasi) {
          if (!rek.pihakBertanggungJawab.trim()) {
            throw new Error('Pihak bertanggung jawab harus diisi');
          }
          if (!rek.batasWaktuImplementasi) {
            throw new Error('Batas waktu implementasi harus diisi');
          }
          if (!rek.rencanaMonitoring.trim()) {
            throw new Error('Rencana monitoring harus diisi');
          }
        }
      }

      if (currentStep < inspections.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.log('Validation failed:', error);
      // Show validation error
      if (error.message) {
        alert(error.message);
      }
      // Form validation will show error messages automatically
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    // Handle form submission here
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const currentInspection = inspections[currentStep];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar - Steps */}
      <div className="col-span-4">
        <div className="sticky top-6">
          <Card className="bg-secondary" styles={{ body: { padding: '12px' } }}>
            <Steps
              direction="vertical"
              current={currentStep}
              items={formStepper}
              className="h-48"
            />
          </Card>
          <Card className="bg-error text-white mt-5">
            <p className="text-sm font-semibold">Perhatian!</p>
            <p className="text-xs mt-1">
              Pemeriksaan internal harus menjaga objektivitas dan independensi
              dalam melaksanakan tugasnya.
            </p>
            <p className="text-xs mt-2">
              Hasil pemeriksaan harus dikomunikasikan secara efektif kepada
              pengurus dan anggota melalui Rapat Anggota Tahunan atau forum yang
              sesuai.
            </p>
          </Card>
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="col-span-8">
        <div className="container">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {currentInspection?.name}
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-6"
          >
            {currentInspection?.inspection_area_details?.map(
              (detail, index) => {
                const listInspections = [
                  {
                    title: 'Indikator Kepatuhan',
                    description: detail.indicator_inspection,
                  },
                  {
                    title: 'Prosedur Pemeriksaan',
                    description: detail.procedure_inspection,
                  },
                  {
                    title: 'Dokumen Referensi',
                    description: detail.document_reference_inspection,
                  },
                ];
                return (
                  <Card key={detail.uuid} className="mb-6 bg-secondary">
                    <h3 className="text-lg font-bold text-primary">
                      {index + 1}. {detail.name}
                    </h3>

                    <List
                      itemLayout="horizontal"
                      dataSource={listInspections}
                      renderItem={(item, index) => (
                        <List.Item key={`${item.title}-${index}`}>
                          <List.Item.Meta
                            title={
                              <p className="text-gray-500">{item.title}</p>
                            }
                            description={
                              <b className="text-black">{item.description}</b>
                            }
                          />
                        </List.Item>
                      )}
                    />

                    <div className="pt-4 border-t border-gray-300">
                      <h4 className="text-primary font-bold border-b text-lg mb-2">
                        Hasil Pemeriksaan
                      </h4>
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8">
                          <Form.Item
                            label={
                              <div className="font-semibold text-primary">
                                Kesimpulan Umum
                              </div>
                            }
                            name={`inspection_${currentInspection.uuid}_detail_${detail.uuid}.result.summary`}
                            rules={[
                              {
                                required: true,
                                message:
                                  'Berikan ringkasan dari hasil pemeriksaan',
                              },
                            ]}
                          >
                            <TextArea
                              rows={4}
                              placeholder="Masukkan ringkasan dari hasil pemeriksaan"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-span-4">
                          <Form.Item
                            label={
                              <div className="font-semibold text-primary">
                                Dokumen
                              </div>
                            }
                            name={`inspection_${currentInspection.uuid}_detail_${detail.uuid}.result.files`}
                            rules={[
                              {
                                required: true,
                                message: 'Silakan lampirkan file yang relevan',
                              },
                            ]}
                          >
                            <Upload
                              name="result_files"
                              action="/upload.do"
                              listType="text"
                              multiple={true}
                              maxCount={2}
                            >
                              <Button icon={<UploadOutlined />}>
                                Lampirkan Dokumen
                              </Button>
                            </Upload>
                          </Form.Item>
                        </div>
                      </div>
                      <Form.Item
                        label={
                          <div className="font-semibold text-primary">
                            Penilaian Kepatuhan
                          </div>
                        }
                        name={`inspection_${currentInspection.uuid}_detail_${detail.uuid}.result.compilance`}
                        rules={[
                          {
                            required: true,
                            message: 'Silakan pilih salah satu opsi penilaian',
                          },
                        ]}
                      >
                        <Radio.Group options={radioOptions} />
                      </Form.Item>
                      <Form.Item
                        label={
                          <div className="font-semibold text-primary">
                            Penilaian Efektivitas
                          </div>
                        }
                        name={`inspection_${currentInspection.uuid}_detail_${detail.uuid}.effectiveness`}
                        rules={[
                          {
                            required: true,
                            message: 'Silakan pilih',
                          },
                        ]}
                      >
                        <Radio.Group buttonStyle="solid">
                          <Radio.Button value={0}>Sangat Rendah</Radio.Button>
                          <Radio.Button value={25}>Rendah</Radio.Button>
                          <Radio.Button value={50}>Sedang</Radio.Button>
                          <Radio.Button value={75}>Tinggi</Radio.Button>
                          <Radio.Button value={100}>Sangat Tinggi</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                    <div className="pt-4 border-t border-gray-300">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-primary font-bold text-lg">
                          Temuan & Rekomendasi
                        </h4>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() =>
                            addTemuan(
                              `${currentInspection.uuid}_${detail.uuid}`
                            )
                          }
                          size="small"
                        >
                          Tambah Temuan
                        </Button>
                      </div>

                      {/* Temuan List */}
                      {(
                        temuanList[
                          `${currentInspection.uuid}_${detail.uuid}`
                        ] || []
                      ).map((temuan, temuanIndex) => (
                        <Card
                          key={temuan.id}
                          className="mb-4 border-l-4 border-l-orange-400"
                          size="small"
                          title={
                            <div className="flex justify-between items-center">
                              <span className="text-orange-600 font-semibold">
                                Temuan {temuanIndex + 1}
                              </span>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() =>
                                  deleteTemuan(
                                    `${currentInspection.uuid}_${detail.uuid}`,
                                    temuan.id
                                  )
                                }
                                size="small"
                              >
                                Hapus
                              </Button>
                            </div>
                          }
                        >
                          <div className="space-y-4">
                            {/* Temuan Name */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Temuan
                              </label>
                              <Input
                                placeholder="Masukkan nama temuan"
                                value={temuan.name}
                                onChange={(e) =>
                                  updateTemuan(
                                    currentInspection.uuid,
                                    temuan.id,
                                    'name',
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* Temuan Description */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Deskripsi Temuan
                              </label>
                              <TextArea
                                placeholder="Masukkan deskripsi temuan"
                                rows={3}
                                value={temuan.description}
                                onChange={(e) =>
                                  updateTemuan(
                                    currentInspection.uuid,
                                    temuan.id,
                                    'description',
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <Divider orientation="left" orientationMargin="0">
                              <div className="flex justify-between items-center w-full">
                                <span className="text-blue-600 font-medium">
                                  Rekomendasi
                                </span>
                                <Button
                                  type="dashed"
                                  icon={<PlusOutlined />}
                                  onClick={() => addRekomendasi(temuan.id)}
                                  size="small"
                                >
                                  Tambah Rekomendasi
                                </Button>
                              </div>
                            </Divider>

                            {/* Rekomendasi List */}
                            {(rekomendasiList[temuan.id] || []).map(
                              (rekomendasi, rekomendasiIndex) => (
                                <Card
                                  key={rekomendasi.id}
                                  className="ml-4 border-l-4 border-l-blue-300"
                                  size="small"
                                  title={
                                    <div className="flex justify-between items-center">
                                      <span className="text-blue-600 font-medium">
                                        Rekomendasi {rekomendasiIndex + 1}
                                      </span>
                                      <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          deleteRekomendasi(
                                            temuan.id,
                                            rekomendasi.id
                                          )
                                        }
                                        size="small"
                                      >
                                        Hapus
                                      </Button>
                                    </div>
                                  }
                                >
                                  <div className="space-y-3">
                                    {/* Pihak Bertanggung Jawab */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pihak Bertanggung Jawab
                                      </label>
                                      <Input
                                        placeholder="Masukkan pihak yang bertanggung jawab"
                                        value={
                                          rekomendasi.pihakBertanggungJawab
                                        }
                                        onChange={(e) =>
                                          updateRekomendasi(
                                            temuan.id,
                                            rekomendasi.id,
                                            'pihakBertanggungJawab',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Batas Waktu Implementasi */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Batas Waktu Implementasi
                                      </label>
                                      <DatePicker
                                        placeholder="Pilih tanggal batas waktu"
                                        className="w-full"
                                        value={
                                          rekomendasi.batasWaktuImplementasi
                                        }
                                        onChange={(date) =>
                                          updateRekomendasi(
                                            temuan.id,
                                            rekomendasi.id,
                                            'batasWaktuImplementasi',
                                            date
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Rencana Monitoring */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rencana Monitoring
                                      </label>
                                      <TextArea
                                        placeholder="Masukkan rencana monitoring"
                                        rows={2}
                                        value={rekomendasi.rencanaMonitoring}
                                        onChange={(e) =>
                                          updateRekomendasi(
                                            temuan.id,
                                            rekomendasi.id,
                                            'rencanaMonitoring',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </Card>
                              )
                            )}

                            {(rekomendasiList[temuan.id] || []).length ===
                              0 && (
                              <div className="ml-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                                Belum ada rekomendasi. Klik "Tambah Rekomendasi"
                                untuk menambahkan.
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}

                      {(
                        temuanList[
                          `${currentInspection.uuid}_${detail.uuid}`
                        ] || []
                      ).length === 0 && (
                        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                          Belum ada temuan. Klik "Tambah Temuan" untuk
                          menambahkan temuan baru.
                        </div>
                      )}
                    </div>
                  </Card>
                );
              }
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                size="large"
              >
                Sebelumnya
              </Button>

              <div className="space-x-3">
                {currentStep < inspections.length - 1 ? (
                  <Button type="primary" onClick={handleNext} size="large">
                    Selanjutnya
                  </Button>
                ) : (
                  <Button type="primary" htmlType="submit" size="large">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BuatFormulirPengawasan;
