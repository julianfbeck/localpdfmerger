import { promises as fs } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { pdfData, filename } = req.body;
    
    if (!pdfData) {
      return res.status(400).json({ error: "No PDF data provided" });
    }

    // Create temp files
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `input_${Date.now()}.pdf`);
    const outputPath = path.join(tempDir, `output_${Date.now()}.pdf`);

    // Write input PDF
    const buffer = Buffer.from(pdfData, "base64");
    await fs.writeFile(inputPath, buffer);

    // Decrypt using qpdf
    try {
      await execAsync(`qpdf --decrypt "${inputPath}" "${outputPath}"`);
      
      // Read decrypted PDF
      const decryptedBuffer = await fs.readFile(outputPath);
      const decryptedBase64 = decryptedBuffer.toString("base64");

      // Cleanup
      await fs.unlink(inputPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});

      return res.status(200).json({ 
        decryptedData: decryptedBase64,
        decrypted: true 
      });
    } catch (qpdfError) {
      // qpdf failed - PDF might not be encrypted or qpdf not available
      console.log("qpdf decrypt failed:", qpdfError.message);
      
      // Cleanup input file
      await fs.unlink(inputPath).catch(() => {});
      
      // Return original data
      return res.status(200).json({ 
        decryptedData: pdfData,
        decrypted: false,
        message: "PDF could not be decrypted (may not be encrypted or qpdf unavailable)"
      });
    }
  } catch (error) {
    console.error("Decrypt API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
