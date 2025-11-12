# Research Management Manual for Staff

## Quick Start Guide

This manual provides instructions for staff members to add and manage publications, research projects, and patents in the HSB-ERP Research Management system.

---

## Adding Publications

### Step-by-Step Instructions

1. **Navigate to Research Module**
   - Click "Research" in the main navigation
   - Select "Publications" tab

2. **Click "+ Add Publication"** button (top right corner)

3. **Fill in Required Fields:**
   - **Title** (required) - Full publication title
   - **Authors** - Comma-separated list (e.g., "Nguyen Van A, Tran Thi B, Le Van C")
   - **Publication Year** - Year of publication
   - **Journal/Conference Name** - Full name of the journal or conference
   - **DOI** - Digital Object Identifier (optional but highly recommended)
   - **Volume** - Journal volume number
   - **Issue** - Journal issue number
   - **Pages** - Page range (e.g., "123-145")
   - **Quartile** - Select from dropdown: Q1, Q2, Q3, Q4, or Scopus-indexed
   - **WoS Ranking** - Web of Science ranking if available
   - **Scopus Indexed** - Check this box if the publication is indexed in Scopus

4. **Click "Add Publication"** to save

5. **Result:** Publication appears immediately in the list with automatic metrics calculation

---

## PubCheck - Automatic Validation Tool

### What is PubCheck?

PubCheck is an automated validation system that scans your publications for quality indicators and predatory journal warnings.

### What PubCheck Checks

**Automatically scans for:**
- ✅ **Scopus Indexing** - Verifies journal name against Scopus database
- ✅ **Web of Science Ranking** - Confirms Q1-Q4 quartile classification
- ⚠️ **Predatory Journal Warning** - Checks against Beall's List 2025

### Understanding PubCheck Results

**Color-coded banners indicate validation status:**

- **🟢 Green Banner**: "Excellent! This publication is indexed in Scopus/WoS"
  - Your publication is verified in a reputable database
  - No action needed

- **🟡 Yellow Banner**: "Could not verify Scopus/WoS indexing - please verify manually"
  - Journal name might be slightly different in database
  - Check manually on Scopus or WoS website
  - Update journal name if needed

- **🔴 Red Banner**: "⚠️ CAUTION - This journal/publisher is in Beall's List (Predatory)"
  - **WARNING:** Journal or publisher is flagged as predatory
  - Do NOT submit publications to this venue
  - If already published, contact Research Office

**Important Note:** If a journal is flagged as predatory, PubCheck will skip Scopus/WoS verification automatically.

### When PubCheck Runs

- ✅ Automatically when adding a new publication
- ✅ Automatically when editing an existing publication
- ✅ Real-time scanning with immediate feedback

---

## Adding Research Projects

### Step-by-Step Instructions

1. **Navigate to Research** → Click "Research Projects" tab

2. **Click "+ Add Project"** button

3. **Fill in Project Details:**
   - **Project Title** (required) - Full project name
   - **Principal Investigator** - Lead researcher name
   - **Start Date** - Project start date
   - **End Date** - Expected or actual completion date
   - **Funding Source** - Organization providing funding (e.g., "Ministry of Education", "NAFOSTED")
   - **Budget Amount** - Total project budget (VND or USD)
   - **Status** - Select from dropdown:
     - Planning
     - Active
     - Completed
     - On Hold
   - **Description** - Brief project overview and objectives
   - **Team Members** - Comma-separated list of team member names

4. **Click "Add Project"** to save

5. **Result:** Project appears in the list with status badge

---

## Adding Patents

### Step-by-Step Instructions

1. **Navigate to Research** → Click "Patents" tab

2. **Click "+ Add Patent"** button

3. **Fill in Patent Information:**
   - **Patent Title** (required) - Official patent name
   - **Inventors** - Comma-separated list of inventor names
   - **Patent Number** - Official registration number (if available)
   - **Filing Date** - Date patent application was filed
   - **Grant Date** - Date patent was granted (leave empty if pending)
   - **Status** - Select from dropdown:
     - Filed
     - Granted
     - Pending
   - **Country** - Country where patent is registered (e.g., "Vietnam", "USA", "PCT")
   - **Abstract** - Brief description of the invention

4. **Click "Add Patent"** to save

5. **Result:** Patent appears in the list with status indicator

---

## Dashboard Overview

### Automatic Metrics Display

The **Overview tab** provides real-time analytics:

#### Top Cards (6 metrics)
1. **Total Publications** - All publications in database
2. **WoS+Scopus Unique** - Publications verified in Web of Science or Scopus
3. **Active Research Projects** - Projects with "Active" status
4. **Patents Granted** - Patents with "Granted" status
5. **Average Impact Factor** - Calculated from journal impact factors
6. **Last 3 Years Publications (2023-2025)** - Recent publication count with breakdown:
   - WoS+Scopus publications
   - Other publications
   - Total publications

#### Visualization
- **Publication Trendline (Last 5 Years)** - Interactive line chart showing publication trends
  - Hover over data points to see yearly totals
  - Automatically filters to last 5 years

#### Activity Feed
- **Recent Activity** - Latest 5 publications with timestamps
- Shows title, authors, and publication year

---

## Best Practices

### For Publications
- ✅ **Always include DOI** when available (improves verification accuracy)
- ✅ **Use full journal names** exactly as they appear officially
- ✅ **Check Scopus Indexed** box only if you are certain
- ✅ **Review PubCheck warnings** before submitting publications
- ⚠️ **Avoid red-flagged journals** - they are on the predatory list

### For Research Projects
- ✅ **Update status regularly** (Planning → Active → Completed)
- ✅ **Include all team members** for proper attribution
- ✅ **Specify funding source** for reporting purposes
- ✅ **Keep budget information accurate** for financial tracking

### For Patents
- ✅ **Record filing date immediately** to track timeline
- ✅ **Update grant date** as soon as patent is approved
- ✅ **List all inventors** in the order specified in patent application
- ✅ **Include patent number** once assigned

---

## Data Storage & Real-time Updates

- All data is **automatically saved to Firebase** cloud database
- Changes are **synchronized in real-time** across all devices
- Dashboard metrics **update automatically** when you add/edit items
- **No manual refresh needed** - UI updates instantly

---

## Troubleshooting

### PubCheck shows yellow warning but journal is reputable

**Solution:**
- Verify journal name spelling on official Scopus/WoS website
- Update journal name to match exactly
- Check if journal has alternative names or abbreviations

### Cannot add publication - validation error

**Possible causes:**
- Title field is empty (required)
- Invalid year format
- Check all required fields are filled

### Publication not appearing in dashboard

**Solution:**
- Refresh the page
- Check filter settings (category, year range)
- Verify publication was saved (check Publications tab)

---

## Support

**Need Help?**
- Contact IT Support: support@hsb.edu.vn
- Research Office: research@hsb.edu.vn
- System Documentation: `/docs/research-module`

---

**Version:** 1.0
**Last Updated:** January 2025
**System:** HSB-ERP Research Management Module
