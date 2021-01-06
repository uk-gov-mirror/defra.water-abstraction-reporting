module.exports = `select
distinct l.licence_ref as "Licence No.",
    cv.charge_version_id as "Charge Version ID",
    ce.charge_element_id as "Charge Element ID",
    ce.description as "Charge Element Description",
    companies.name as "Licence Holder Name",
    l.start_date as "Orig. Effective Date",
    l.expired_date as "Expiry date",
    ce.time_limited_start_date as "TL Start",
    ce.time_limited_end_date as "TL End",
    cv.invoice_account_id as "Invoice Account ID",
    ia.invoice_account_number as "Invoice Account Reference",
    ce.authorised_annual_quantity as "Authorised Annual Qty",
    ce.billable_annual_quantity as "Billable Annual Qty",
    ce.season as "Season",
    ce.loss as "Loss Factor",
    fat.financial_agreement_code as "Financial Agreement Code",
    fat.description as "Financial Agreement Description",
    l.regions->>'regionalChargeArea' as "Regional Charge Area",
    l.regions->>'SUC' as "SUC Code",
    l.regions->>'LEAP' as "LEAP Code",
    pp.legacy_id as "Primary Use Code",
    pp.description as "Primary Use Description",
    ps.legacy_id as "Secondary Use Code",
    ps.description as "Secondary Use Description"
from
water.licences l
left join water.licence_agreements la on
la.licence_ref = l.licence_ref
left join water.financial_agreement_types fat on
fat.financial_agreement_type_id = la.financial_agreement_type_id
join water.charge_versions cv on
cv.licence_ref = l.licence_ref
join water.billing_batch_charge_version_years bbcvy on
bbcvy.charge_version_id = cv.charge_version_id
join water.billing_batches bb on 
bb.billing_batch_id = bbcvy.billing_batch_id 
join water.charge_elements ce on
ce.charge_version_id = cv.charge_version_id
left join crm_v2.invoice_accounts ia on
ia.invoice_account_id = cv.invoice_account_id
left join water.purposes_primary pp on
pp.purpose_primary_id = ce.purpose_primary_id
left join water.purposes_secondary ps on
ps.purpose_secondary_id = ce.purpose_secondary_id
join crm_v2.documents v2doc on
v2doc.document_ref = l.licence_ref
and v2doc.status = 'current'
join crm_v2.document_roles v2docRoles on
v2docRoles.document_id = v2doc.document_id
and( v2doc.end_date is null
or v2doc.end_date >= NOW())
join crm_v2.companies companies on
companies.company_id = v2docRoles.company_id
where
(l.expired_date is null
or l.expired_date >= NOW())
and (l.revoked_date is null
or l.revoked_date >= NOW())
and (cv.end_date is null
or cv.end_date >= NOW())
and bbcvy.financial_year_ending = $1
and bb.status = 'sent'`;
