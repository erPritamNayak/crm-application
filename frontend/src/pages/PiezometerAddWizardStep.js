import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

function LocalImagePreviews({ files }) {
  const list = Array.isArray(files) ? files : [];
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    const imgs = list.filter((f) => f && typeof f.type === 'string' && f.type.startsWith('image/'));
    const u = imgs.map((f) => URL.createObjectURL(f));
    setUrls(u);
    return () => {
      u.forEach((x) => URL.revokeObjectURL(x));
    };
  }, [list]);
  if (!urls.length) return null;
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {urls.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={list[i]?.name ? `Preview ${list[i].name}` : `Preview ${i + 1}`}
          className="h-20 w-20 rounded border border-gray-200 object-cover bg-gray-100"
        />
      ))}
    </div>
  );
}

export const EMPTY_PIEZO_ROW = {
  piezometer_make: '',
  piezometer_serial: '',
  sensor_cable_length: '',
  calibration_valid_from: '',
  calibration_valid_to: '',
  telemetry_applicable: '',
  telemetry_company: '',
  telemetry_company_other: '',
  telemetry_communication_via: '',
  telemetry_sim_provider: '',
  telemetry_sim_provider_other: '',
  telemetry_sim_number: '',
  telemetry_sim_valid_from: '',
  telemetry_sim_valid_to: '',
  telemetry_product_code: '',
  telemetry_serial_number: '',
  telemetry_portal_url: '',
  telemetry_username: '',
  telemetry_password: '',
  telemetry_valid_from: '',
  telemetry_valid_to: '',
  telemetry_uploaded_previous_year: '',
  telemetry_previous_serial_pick: '',
  telemetry_previous_serial_free: '',
  telemetry_previous_data_available: '',
  telemetry_previous_data_from: '',
  telemetry_previous_data_to: '',
};

export const EMPTY_PIEZO_FILES = () => ({
  bwPhotos: [],
  calibrationCert: undefined,
  telemetryPhotos: [],
  telemetryExcel: undefined,
  priorTelemetryService: undefined,
});

export function piezoRowToPersist(r) {
  const pick = (r.telemetry_previous_serial_pick || '').trim();
  const free = (r.telemetry_previous_serial_free || '').trim();
  const telemetry_previous_serial = pick === '__manual__' ? free : pick;
  const { telemetry_previous_serial_pick: _p, telemetry_previous_serial_free: _f, ...rest } = r;
  return { ...rest, telemetry_previous_serial: telemetry_previous_serial || null };
}

function PiezometerAddWizardStep({
  piezometerRows,
  setPiezometerRows,
  piezometerFiles,
  setPiezometerFiles,
  telemetrySerialOptions,
  countLabel,
  onSubmit,
  submitting,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Piezometer details</h3>
        <p className="text-xs text-gray-600 mt-1">
          NOC specifies {countLabel}. Enter details for each piezometer below. Inventory rows are created only when you click Submit—piezometer
          data is stored as JSON on each new row; file uploads run after the records exist (by row index when possible).
        </p>
      </div>
      <div className="space-y-4 max-h-[min(72vh,720px)] overflow-y-auto pr-1">
        {piezometerRows.map((row, idx) => {
          const patchRow = (patch) =>
            setPiezometerRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
          const bundle = piezometerFiles[idx] || {};
          const patchBundle = (patch) =>
            setPiezometerFiles((prev) => prev.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
          const setOneFile = (key, file) =>
            setPiezometerFiles((prev) => prev.map((b, i) => (i === idx ? { ...b, [key]: file || undefined } : b)));

          return (
            <Card key={idx} className="p-4 border border-gray-200 space-y-4">
              <p className="text-sm font-semibold text-gray-800">Piezometer {idx + 1}</p>

              <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-3">
                <p className="text-sm font-semibold text-gray-800">Piezometer</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Make</Label>
                    <Input
                      value={row.piezometer_make}
                      onChange={(e) => patchRow({ piezometer_make: e.target.value })}
                      className="h-11 border border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Serial number</Label>
                    <Input
                      value={row.piezometer_serial}
                      onChange={(e) => patchRow({ piezometer_serial: e.target.value })}
                      className="h-11 border border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Length of sensor cable</Label>
                    <Input
                      value={row.sensor_cable_length}
                      onChange={(e) => patchRow({ sensor_cable_length: e.target.value })}
                      className="h-11 border border-gray-300"
                    />
                  </div>
                </div>
                <div className="space-y-2 border-t border-gray-200 pt-3">
                  <Label className="text-sm font-medium text-gray-700">BW with piezometer photo</Label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
                    onChange={(e) => {
                      const picked = e.target.files ? Array.from(e.target.files) : [];
                      e.target.value = '';
                      const imgs = picked.filter(
                        (f) => f.type.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(f.name)
                      );
                      if (imgs.length < picked.length) toast.error('BW piezometer photos accept image files only');
                      patchBundle({ bwPhotos: imgs });
                    }}
                    className="h-11 text-sm"
                  />
                  <LocalImagePreviews files={bundle.bwPhotos} />
                  {(bundle.bwPhotos || []).length > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-gray-600"
                      onClick={() => patchBundle({ bwPhotos: [] })}
                    >
                      Clear BW photos
                    </Button>
                  ) : (
                    <p className="text-xs text-gray-400">Multiple images; preview above; uploads after save (S3).</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 space-y-3">
                <p className="text-sm font-semibold text-gray-800">Calibration certificate</p>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Certificate (file)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,application/pdf,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = '';
                      setOneFile('calibrationCert', f);
                    }}
                    className="h-11 text-sm"
                  />
                  {bundle.calibrationCert ? (
                    <p className="text-xs text-gray-600">Selected: {bundle.calibrationCert.name}</p>
                  ) : (
                    <p className="text-xs text-gray-400">Uploads after save (S3).</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Valid from</Label>
                    <Input
                      type="date"
                      value={row.calibration_valid_from}
                      onChange={(e) => patchRow({ calibration_valid_from: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Valid to</Label>
                    <Input
                      type="date"
                      value={row.calibration_valid_to}
                      onChange={(e) => patchRow({ calibration_valid_to: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Is applicable telemetry system?</Label>
                <select
                  value={row.telemetry_applicable}
                  onChange={(e) => patchRow({ telemetry_applicable: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 h-11"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {row.telemetry_applicable === 'yes' ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-4">
                  <p className="text-sm font-semibold text-gray-800">Telemetry system</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Telemetry company</Label>
                      <select
                        value={row.telemetry_company}
                        onChange={(e) => patchRow({ telemetry_company: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 h-11"
                      >
                        <option value="">Select</option>
                        <option value="frinso">FRINSO</option>
                        <option value="ubiqedge">UBIQEDGE</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {row.telemetry_company === 'other' ? (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Company name (manual)</Label>
                        <Input
                          value={row.telemetry_company_other}
                          onChange={(e) => patchRow({ telemetry_company_other: e.target.value })}
                          className="h-11"
                        />
                      </div>
                    ) : null}
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-700">Telemetry communication via</Label>
                      <select
                        value={row.telemetry_communication_via}
                        onChange={(e) => patchRow({ telemetry_communication_via: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 h-11 max-w-md"
                      >
                        <option value="">Select</option>
                        <option value="sim">SIM</option>
                        <option value="wifi">Wi-Fi</option>
                        <option value="ethernet">Ethernet</option>
                      </select>
                    </div>
                  </div>

                  {row.telemetry_communication_via === 'sim' ? (
                    <div className="rounded-md border border-gray-200 bg-white p-3 space-y-3">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Telemetry SIM</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">SIM provider</Label>
                          <select
                            value={row.telemetry_sim_provider}
                            onChange={(e) => patchRow({ telemetry_sim_provider: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 h-11"
                          >
                            <option value="">Select</option>
                            <option value="airtel">Airtel</option>
                            <option value="jio">Jio</option>
                            <option value="bsnl">BSNL</option>
                            <option value="vodafone">Vodafone</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        {row.telemetry_sim_provider === 'other' ? (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Provider (manual)</Label>
                            <Input
                              value={row.telemetry_sim_provider_other}
                              onChange={(e) => patchRow({ telemetry_sim_provider_other: e.target.value })}
                              className="h-11"
                            />
                          </div>
                        ) : null}
                        <div className="space-y-2 sm:col-span-2">
                          <Label className="text-sm font-medium text-gray-700">SIM number</Label>
                          <Input
                            value={row.telemetry_sim_number}
                            onChange={(e) => patchRow({ telemetry_sim_number: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">SIM valid from</Label>
                          <Input
                            type="date"
                            value={row.telemetry_sim_valid_from}
                            onChange={(e) => patchRow({ telemetry_sim_valid_from: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">SIM valid to</Label>
                          <Input
                            type="date"
                            value={row.telemetry_sim_valid_to}
                            onChange={(e) => patchRow({ telemetry_sim_valid_to: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Telemetry product code</Label>
                      <Input
                        value={row.telemetry_product_code}
                        onChange={(e) => patchRow({ telemetry_product_code: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Telemetry serial number</Label>
                      <Input
                        value={row.telemetry_serial_number}
                        onChange={(e) => patchRow({ telemetry_serial_number: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 rounded-md border border-gray-200 bg-white p-3">
                    <Label className="text-sm font-medium text-gray-700">Upload telemetry photo</Label>
                    <Input
                      type="file"
                      multiple
                      accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
                      onChange={(e) => {
                        const picked = e.target.files ? Array.from(e.target.files) : [];
                        e.target.value = '';
                        const imgs = picked.filter(
                          (f) => f.type.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(f.name)
                        );
                        if (imgs.length < picked.length) toast.error('Telemetry photos accept image files only');
                        patchBundle({ telemetryPhotos: imgs });
                      }}
                      className="h-11 text-sm"
                    />
                    <LocalImagePreviews files={bundle.telemetryPhotos} />
                    {(bundle.telemetryPhotos || []).length > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-gray-600"
                        onClick={() => patchBundle({ telemetryPhotos: [] })}
                      >
                        Clear telemetry photos
                      </Button>
                    ) : (
                      <p className="text-xs text-gray-400">Multiple images; preview above.</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-sm font-medium text-gray-700">Telemetry portal URL</Label>
                      <Input
                        type="url"
                        value={row.telemetry_portal_url}
                        onChange={(e) => patchRow({ telemetry_portal_url: e.target.value })}
                        placeholder="https://…"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Username</Label>
                      <Input
                        value={row.telemetry_username}
                        onChange={(e) => patchRow({ telemetry_username: e.target.value })}
                        className="h-11"
                        autoComplete="off"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Password</Label>
                      <Input
                        type="password"
                        value={row.telemetry_password}
                        onChange={(e) => patchRow({ telemetry_password: e.target.value })}
                        className="h-11"
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Telemetry valid from</Label>
                      <Input
                        type="date"
                        value={row.telemetry_valid_from}
                        onChange={(e) => patchRow({ telemetry_valid_from: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Telemetry valid to</Label>
                      <Input
                        type="date"
                        value={row.telemetry_valid_to}
                        onChange={(e) => patchRow({ telemetry_valid_to: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Is telemetry uploaded previous year?</Label>
                    <select
                      value={row.telemetry_uploaded_previous_year}
                      onChange={(e) => patchRow({ telemetry_uploaded_previous_year: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 h-11 max-w-md"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {row.telemetry_uploaded_previous_year === 'yes' ? (
                    <div className="rounded-md border border-gray-200 bg-gray-50/80 p-3 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Telemetry serial number</Label>
                        <select
                          value={row.telemetry_previous_serial_pick}
                          onChange={(e) => patchRow({ telemetry_previous_serial_pick: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 h-11"
                        >
                          <option value="">Select serial</option>
                          {telemetrySerialOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                          <option value="__manual__">Other (enter manually)</option>
                        </select>
                      </div>
                      {row.telemetry_previous_serial_pick === '__manual__' ? (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">Serial number (manual)</Label>
                          <Input
                            value={row.telemetry_previous_serial_free}
                            onChange={(e) => patchRow({ telemetry_previous_serial_free: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      ) : null}

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">If old telemetry data is available</Label>
                        <select
                          value={row.telemetry_previous_data_available}
                          onChange={(e) => patchRow({ telemetry_previous_data_available: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 h-11 max-w-md"
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      {row.telemetry_previous_data_available === 'yes' ? (
                        <div className="space-y-3 pt-1 border-t border-gray-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">From date</Label>
                              <Input
                                type="date"
                                value={row.telemetry_previous_data_from}
                                onChange={(e) => patchRow({ telemetry_previous_data_from: e.target.value })}
                                className="h-11"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">To date</Label>
                              <Input
                                type="date"
                                value={row.telemetry_previous_data_to}
                                onChange={(e) => patchRow({ telemetry_previous_data_to: e.target.value })}
                                className="h-11"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Upload Excel data</Label>
                            <Input
                              type="file"
                              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                e.target.value = '';
                                setOneFile('telemetryExcel', f);
                              }}
                              className="h-11 text-sm"
                            />
                            {bundle.telemetryExcel ? (
                              <p className="text-xs text-gray-600">Selected: {bundle.telemetryExcel.name}</p>
                            ) : null}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Upload service report</Label>
                            <Input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,application/pdf,image/*"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                e.target.value = '';
                                setOneFile('priorTelemetryService', f);
                              }}
                              className="h-11 text-sm"
                            />
                            {bundle.priorTelemetryService ? (
                              <p className="text-xs text-gray-600">Selected: {bundle.priorTelemetryService.name}</p>
                            ) : (
                              <p className="text-xs text-gray-400">Optional prior-year service report.</p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
      {typeof onSubmit === 'function' ? (
        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-600 order-2 sm:order-1">Submit creates the flow metre record(s), then uploads flow metre and piezometer attachments.</p>
          <Button
            type="button"
            disabled={!!submitting}
            className="order-1 w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 sm:order-2 sm:w-auto min-w-[8rem]"
            onClick={onSubmit}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default PiezometerAddWizardStep;
