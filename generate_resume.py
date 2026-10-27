#!/usr/bin/env python3
"""Generate Amiya Samal resume PDF and DOCX with CRM project."""

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt, RGBColor
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT_DIR = Path(__file__).resolve().parent

CRM_BULLETS = [
    "Built Resoline CRM, a full-stack business operations platform using React.js, FastAPI (Python), and MySQL, covering leads, customers, employees, and role-based access control.",
    "Implemented lead and customer management with detailed workspaces, document handling, and AWS S3 file storage for attachments and photos.",
    "Developed attendance with GPS punch-in/out, late-punch approval workflows, leave management, and a live location tracker on maps for field staff.",
    "Designed a Kanban task board with priorities, due dates, comments, time logs, completion tracking, and file attachments for team collaboration.",
    "Added inventory and stock management with warehouses, purchase receipts, transfers, weighted-average costing, and reorder alerts.",
    "Built vehicle tracking and fuel expense claims with meter-photo verification, distance/fuel calculation, and admin approval flows.",
    "Delivered supporting modules for expenses, payroll/salary, operations workspace, service maintenance, dashboards, and monthly reports.",
    "Used JWT authentication, permission-based roles, REST APIs, and responsive UI (Tailwind/Radix) for secure multi-user access across desktop and mobile.",
]


def build_docx(path: Path) -> None:
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.55)
    section.bottom_margin = Inches(0.55)
    section.left_margin = Inches(0.7)
    section.right_margin = Inches(0.7)

    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(10)

    name = doc.add_paragraph()
    name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = name.add_run("AMIYA SAMAL")
    run.bold = True
    run.font.size = Pt(18)
    run.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)

    contact = doc.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    c = contact.add_run(
        "amiyasamal833@gmail.com  |  +91 8144928667  |  Bhubaneswar, Odisha, India\n"
        "linkedin.com/in/amiyasamal"
    )
    c.font.size = Pt(9)
    c.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

    def heading(text: str) -> None:
        p = doc.add_paragraph()
        r = p.add_run(text)
        r.bold = True
        r.font.size = Pt(11)
        r.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        border = doc.add_paragraph()
        border.paragraph_format.space_before = Pt(0)
        border.paragraph_format.space_after = Pt(4)
        # visual separator via underscore line
        br = border.add_run("─" * 78)
        br.font.size = Pt(6)
        br.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)

    def body(text: str, bold: bool = False, size: int = 10) -> None:
        p = doc.add_paragraph()
        r = p.add_run(text)
        r.bold = bold
        r.font.size = Pt(size)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.space_before = Pt(0)

    def bullet(text: str) -> None:
        p = doc.add_paragraph(style="List Bullet")
        p.clear()
        r = p.add_run(text)
        r.font.size = Pt(9.5)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Inches(0.25)

    heading("ABOUT ME")
    about = (
        "Motivated and detail-oriented fresher with a strong passion for software development. "
        "Enthusiastic about learning new technologies and applying problem-solving skills to "
        "real-world challenges. Passionate about full-stack development, particularly the MERN "
        "stack, and eager to work on innovative projects that enhance user experience and "
        "efficiency. A quick learner with strong analytical skills and a collaborative mindset, "
        "aiming to apply technical skills to real-world applications."
    )
    p = doc.add_paragraph(about)
    for run in p.runs:
        run.font.size = Pt(9.5)
    p.paragraph_format.space_after = Pt(4)

    heading("WORK EXPERIENCE")
    body("FREELANCE WEB DEVELOPER  |  Self-Employed  |  01/2024 – Present", bold=True, size=10)
    bullet("Implemented responsive design techniques for better user experience.")
    bullet("Managed website hosting and maintenance for clients.")

    heading("EDUCATION")
    body(
        "Bachelor of Technology in Computer Science, GANDHI ENGINEERING COLLEGE  |  2022 – 2026",
        bold=True,
        size=10,
    )
    body("Bhubaneswar, Odisha, India", size=9)
    body(
        "Intermediate in Science (ISC) - Science, SADHU GOURESWAR COLLEGE  |  2020 – 2022 (70.33%)",
        bold=True,
        size=10,
    )
    body("Jajpur, Odisha, India", size=9)
    body(
        "Primary Education, KANTABANIA HIGH SCHOOL  |  2020 (68.83%)",
        bold=True,
        size=10,
    )
    body("Jajpur, Odisha, India", size=9)

    heading("SKILLS")
    skills = [
        ("Programming Languages", "C, C++, Python, Java"),
        ("Web Development", "HTML, CSS, JavaScript, MERN Stack (MongoDB, Express.js, React.js, Node.js), FastAPI"),
        ("Database", "MySQL, SQLite"),
        ("Tools & Practices", "Git & GitHub, REST APIs, AWS S3"),
        ("Soft Skills", "Problem Solving, Logical Thinking, Communication & Teamwork"),
    ]
    for label, value in skills:
        p = doc.add_paragraph()
        r1 = p.add_run(f"{label}: ")
        r1.bold = True
        r1.font.size = Pt(9.5)
        r2 = p.add_run(value)
        r2.font.size = Pt(9.5)
        p.paragraph_format.space_after = Pt(1)

    heading("PROJECTS")
    body("PERSONAL PORTFOLIO WEBSITE", bold=True, size=10)
    body(
        "Designed and developed a personal portfolio website to showcase projects and skills "
        "using HTML, CSS, and JavaScript. Technologies Used: HTML, CSS, JavaScript, Bootstrap",
        size=9.5,
    )

    body("RESOLINE CRM — Full-Stack Business Operations Platform", bold=True, size=10)
    for item in CRM_BULLETS:
        bullet(item)

    heading("CERTIFICATIONS")
    body("Introduction to Python  |  Full-stack web development  |  Data Analysis", size=9.5)

    doc.save(path)


def build_pdf(path: Path) -> None:
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.5 * inch,
    )
    styles = getSampleStyleSheet()
    navy = HexColor("#1A365D")
    gray = HexColor("#333333")

    styles.add(
        ParagraphStyle(
            name="Name",
            fontName="Helvetica-Bold",
            fontSize=18,
            textColor=navy,
            alignment=TA_CENTER,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Contact",
            fontName="Helvetica",
            fontSize=9,
            textColor=gray,
            alignment=TA_CENTER,
            leading=12,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Section",
            fontName="Helvetica-Bold",
            fontSize=11,
            textColor=navy,
            spaceBefore=8,
            spaceAfter=2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyText2",
            fontName="Helvetica",
            fontSize=9.5,
            textColor=black,
            leading=12,
            alignment=TA_JUSTIFY,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="JobTitle",
            fontName="Helvetica-Bold",
            fontSize=10,
            textColor=black,
            spaceBefore=2,
            spaceAfter=2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BulletText",
            fontName="Helvetica",
            fontSize=9.5,
            textColor=black,
            leading=12,
            leftIndent=12,
            spaceAfter=2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SkillLine",
            fontName="Helvetica",
            fontSize=9.5,
            textColor=black,
            leading=12,
            spaceAfter=1,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Meta",
            fontName="Helvetica",
            fontSize=9,
            textColor=gray,
            spaceAfter=2,
        )
    )

    story = []
    story.append(Paragraph("AMIYA SAMAL", styles["Name"]))
    story.append(
        Paragraph(
            "amiyasamal833@gmail.com &nbsp;&nbsp;|&nbsp;&nbsp; +91 8144928667 "
            "&nbsp;&nbsp;|&nbsp;&nbsp; Bhubaneswar, Odisha, India<br/>"
            "linkedin.com/in/amiyasamal",
            styles["Contact"],
        )
    )

    def section(title: str) -> None:
        story.append(Paragraph(title, styles["Section"]))
        story.append(
            HRFlowable(width="100%", thickness=1, color=navy, spaceBefore=0, spaceAfter=6)
        )

    section("ABOUT ME")
    story.append(
        Paragraph(
            "Motivated and detail-oriented fresher with a strong passion for software development. "
            "Enthusiastic about learning new technologies and applying problem-solving skills to "
            "real-world challenges. Passionate about full-stack development, particularly the MERN "
            "stack, and eager to work on innovative projects that enhance user experience and "
            "efficiency. A quick learner with strong analytical skills and a collaborative mindset, "
            "aiming to apply technical skills to real-world applications.",
            styles["BodyText2"],
        )
    )

    section("WORK EXPERIENCE")
    story.append(
        Paragraph(
            "FREELANCE WEB DEVELOPER &nbsp;|&nbsp; Self-Employed &nbsp;|&nbsp; 01/2024 – Present",
            styles["JobTitle"],
        )
    )
    story.append(
        Paragraph(
            "• Implemented responsive design techniques for better user experience.",
            styles["BulletText"],
        )
    )
    story.append(
        Paragraph(
            "• Managed website hosting and maintenance for clients.",
            styles["BulletText"],
        )
    )

    section("EDUCATION")
    story.append(
        Paragraph(
            "Bachelor of Technology in Computer Science, GANDHI ENGINEERING COLLEGE &nbsp;|&nbsp; 2022 – 2026",
            styles["JobTitle"],
        )
    )
    story.append(Paragraph("Bhubaneswar, Odisha, India", styles["Meta"]))
    story.append(
        Paragraph(
            "Intermediate in Science (ISC) - Science, SADHU GOURESWAR COLLEGE &nbsp;|&nbsp; 2020 – 2022 (70.33%)",
            styles["JobTitle"],
        )
    )
    story.append(Paragraph("Jajpur, Odisha, India", styles["Meta"]))
    story.append(
        Paragraph(
            "Primary Education, KANTABANIA HIGH SCHOOL &nbsp;|&nbsp; 2020 (68.83%)",
            styles["JobTitle"],
        )
    )
    story.append(Paragraph("Jajpur, Odisha, India", styles["Meta"]))

    section("SKILLS")
    skills = [
        ("<b>Programming Languages:</b> C, C++, Python, Java"),
        (
            "<b>Web Development:</b> HTML, CSS, JavaScript, MERN Stack "
            "(MongoDB, Express.js, React.js, Node.js), FastAPI"
        ),
        ("<b>Database:</b> MySQL, SQLite"),
        ("<b>Tools &amp; Practices:</b> Git &amp; GitHub, REST APIs, AWS S3"),
        ("<b>Soft Skills:</b> Problem Solving, Logical Thinking, Communication &amp; Teamwork"),
    ]
    for line in skills:
        story.append(Paragraph(line, styles["SkillLine"]))

    section("PROJECTS")
    story.append(Paragraph("PERSONAL PORTFOLIO WEBSITE", styles["JobTitle"]))
    story.append(
        Paragraph(
            "Designed and developed a personal portfolio website to showcase projects and skills "
            "using HTML, CSS, and JavaScript. Technologies Used: HTML, CSS, JavaScript, Bootstrap",
            styles["BodyText2"],
        )
    )

    story.append(
        Paragraph(
            "RESOLINE CRM — Full-Stack Business Operations Platform",
            styles["JobTitle"],
        )
    )
    for item in CRM_BULLETS:
        story.append(Paragraph(f"• {item}", styles["BulletText"]))

    section("CERTIFICATIONS")
    story.append(
        Paragraph(
            "Introduction to Python &nbsp;|&nbsp; Full-stack web development &nbsp;|&nbsp; Data Analysis",
            styles["BodyText2"],
        )
    )

    doc.build(story)


def main() -> None:
    pdf_path = OUT_DIR / "AMIYA_Resume.pdf"
    docx_path = OUT_DIR / "AMIYA_Resume.docx"
    build_pdf(pdf_path)
    build_docx(docx_path)
    print(f"Wrote {pdf_path}")
    print(f"Wrote {docx_path}")
    print(f"CRM bullets: {len(CRM_BULLETS)}")


if __name__ == "__main__":
    main()
