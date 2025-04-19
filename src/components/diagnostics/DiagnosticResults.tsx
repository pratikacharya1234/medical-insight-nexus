
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Download, Info, AlertCircle, CheckCircle, Activity, FileText, MessageCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Simulated diagnostic result data
const sampleResults = {
  patientId: "P12345",
  analysisDate: "2025-04-19",
  primaryDiagnosis: "Lobar Pneumonia",
  confidenceScore: 92,
  alternativeDiagnoses: [
    { condition: "Bronchitis", confidence: 45 },
    { condition: "Pleural Effusion", confidence: 38 },
    { condition: "Pulmonary Edema", confidence: 21 },
  ],
  keyFindings: [
    "Consolidation in right lower lobe",
    "Air bronchograms visible",
    "No pleural effusion detected",
    "Mild peribronchial thickening",
  ],
  recommendedFollowUp: [
    "Chest X-ray in 2 weeks to confirm resolution",
    "Complete blood count to monitor inflammatory markers",
    "Pulmonary function tests if symptoms persist",
  ],
  imageAnalysis: {
    areas: [
      { name: "Right Lower Lobe", abnormality: "Consolidation", severity: "Moderate" },
      { name: "Right Middle Lobe", abnormality: "Minimal Involvement", severity: "Mild" },
      { name: "Left Lung", abnormality: "No Significant Findings", severity: "None" },
      { name: "Pleural Space", abnormality: "No Effusion", severity: "None" },
    ],
  },
  chartData: {
    progression: [
      { date: "Apr 10", value: 92 },
      { date: "Apr 15", value: 76 },
      { date: "Apr 19", value: 43 },
      { date: "Apr 24", value: 21 },
      { date: "Apr 29", value: 10 },
    ],
    lobe: [
      { name: "Right Upper", value: 15 },
      { name: "Right Middle", value: 22 },
      { name: "Right Lower", value: 78 },
      { name: "Left Upper", value: 5 },
      { name: "Left Lower", value: 8 },
    ],
  },
  geminiExplanation: `The analysis of this chest X-ray shows clear evidence of right lower lobe pneumonia. 
  The consolidation pattern is consistent with bacterial lobar pneumonia, showing a homogeneous opacity with air bronchograms. 
  The absence of pleural effusion and the sharp demarcation of the opacity suggests a uncomplicated pneumonia rather than 
  other diagnoses like pulmonary edema or pleural effusion. The peribronchial thickening may indicate some additional 
  inflammatory response in the airways, but this is a common accompanying finding with pneumonia.
  
  Based on the radiographic findings and clinical information provided, this most likely represents community-acquired 
  bacterial pneumonia, most commonly caused by Streptococcus pneumoniae. The confined nature of the consolidation to 
  primarily the right lower lobe is typical for this diagnosis.`,
};

interface SeverityIndicatorProps {
  label: string;
  value: number;
  color?: string;
}

const SeverityIndicator = ({ label, value, color = "bg-medical-primary" }: SeverityIndicatorProps) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Progress
        value={value}
        className={`h-2 ${color}`}
      />
    </div>
  );
};

export default function DiagnosticResults() {
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const [currentTab, setCurrentTab] = useState("overview");
  
  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 80) return "bg-medical-success text-white";
    if (confidence >= 60) return "bg-medical-warning text-black";
    return "bg-medical-danger text-white";
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "severe":
        return "bg-medical-danger text-white";
      case "moderate":
        return "bg-medical-warning text-black";
      case "mild":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-green-200 text-green-800";
    }
  };

  const truncateExplanation = (text: string, maxLength = 250) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Diagnostic Results</CardTitle>
            <CardDescription className="mt-1">
              Analysis completed on {sampleResults.analysisDate} • Patient ID: {sampleResults.patientId}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          defaultValue="overview"
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <div className="border-b px-6">
            <TabsList className="w-full justify-start bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-medical-primary data-[state=active]:shadow-none rounded-none px-4 py-3 data-[state=active]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="data-[state=active]:border-b-2 data-[state=active]:border-medical-primary data-[state=active]:shadow-none rounded-none px-4 py-3 data-[state=active]:bg-transparent"
              >
                Detailed Analysis
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="data-[state=active]:border-b-2 data-[state=active]:border-medical-primary data-[state=active]:shadow-none rounded-none px-4 py-3 data-[state=active]:bg-transparent"
              >
                Images
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="data-[state=active]:border-b-2 data-[state=active]:border-medical-primary data-[state=active]:shadow-none rounded-none px-4 py-3 data-[state=active]:bg-transparent"
              >
                Recommendations
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="m-0 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-medical-primary">
                        Primary Diagnosis
                      </h3>
                      <p className="text-2xl font-bold">{sampleResults.primaryDiagnosis}</p>
                    </div>
                    <Badge
                      className={`${getConfidenceBadgeColor(
                        sampleResults.confidenceScore
                      )} text-sm px-3 py-1`}
                    >
                      {sampleResults.confidenceScore}% Confidence
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-3">Alternative Diagnoses</h4>
                    <div className="space-y-3">
                      {sampleResults.alternativeDiagnoses.map((diag) => (
                        <SeverityIndicator 
                          key={diag.condition}
                          label={diag.condition}
                          value={diag.confidence}
                          color={
                            diag.confidence > 70
                              ? "bg-medical-warning"
                              : diag.confidence > 40
                              ? "bg-yellow-400"
                              : "bg-gray-400"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Key Findings</h4>
                  <ul className="space-y-2">
                    {sampleResults.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-medical-success mr-2 flex-shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-medical-primary" />
                    Disease Progression Prediction
                  </h4>
                  <div className="h-[200px]">
                    <LineChart
                      data={sampleResults.chartData.progression.map(item => ({
                        name: item.date,
                        value: item.value
                      }))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Predicted progression of condition over time with standard treatment
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1 text-medical-primary" />
                    AI Assessment Explanation
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-muted-foreground">
                      {showFullExplanation
                        ? sampleResults.geminiExplanation
                        : truncateExplanation(sampleResults.geminiExplanation)}
                    </p>
                    {sampleResults.geminiExplanation.length > 250 && (
                      <Button
                        variant="link"
                        onClick={() => setShowFullExplanation(!showFullExplanation)}
                        className="p-0 h-auto text-medical-primary"
                      >
                        {showFullExplanation ? "Show less" : "Read more"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="m-0 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Affected Areas Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sampleResults.imageAnalysis.areas.map((area, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">{area.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {area.abnormality}
                            </p>
                          </div>
                          <Badge className={getSeverityBadgeColor(area.severity)}>
                            {area.severity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Lobe Involvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <BarChart 
                        data={sampleResults.chartData.lobe.map(item => ({
                          name: item.name,
                          value: item.value
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Diagnostic Reasoning</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        <p>
                          The analysis of the chest X-ray reveals a well-defined area of consolidation in the right lower lobe, characterized by homogeneous opacity with visible air bronchograms. This finding strongly suggests lobar pneumonia.
                        </p>
                        <p>
                          Several features support this diagnosis:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>The consolidated area has sharp margins, typical of lobar pneumonia</li>
                          <li>Air bronchograms indicate the alveoli are filled with exudate while bronchi remain air-filled</li>
                          <li>Absence of pleural effusion suggests uncomplicated pneumonia</li>
                          <li>The anatomical distribution is confined primarily to the right lower lobe</li>
                        </ul>
                        <p>
                          Alternative diagnoses considered:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Bronchitis:</span> Less likely due to the lobar consolidation pattern rather than peribronchial thickening
                          </li>
                          <li>
                            <span className="font-medium">Pleural Effusion:</span> Ruled out by the absence of blunting of costophrenic angles and lack of meniscus sign
                          </li>
                          <li>
                            <span className="font-medium">Pulmonary Edema:</span> The unilateral nature and lack of perihilar prominence make this less likely
                          </li>
                        </ul>
                        <p>
                          The radiographic presentation is most consistent with community-acquired bacterial pneumonia, commonly caused by Streptococcus pneumoniae, given the lobar distribution and consolidation pattern.
                        </p>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Literature References</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[140px]">
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                          <FileText className="h-4 w-4 mr-2 mt-0.5 text-medical-primary" />
                          <span>
                            <span className="font-medium">Franquet T.</span> (2024). "Imaging of Community-acquired Pneumonia." <i>Radiology</i>, 301(2), 315-331.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FileText className="h-4 w-4 mr-2 mt-0.5 text-medical-primary" />
                          <span>
                            <span className="font-medium">Metlay JP, et al.</span> (2025). "Diagnosis and Treatment of Adults with Community-acquired Pneumonia." <i>JAMA</i>, 155(4), 1233-1243.
                          </span>
                        </li>
                        <li className="flex items-start">
                          <FileText className="h-4 w-4 mr-2 mt-0.5 text-medical-primary" />
                          <span>
                            <span className="font-medium">Chalmers JD, et al.</span> (2024). "Epidemiology, Antibiotic Therapy, and Clinical Outcomes in Lobar Pneumonia: A Systematic Review." <i>Lancet Respiratory Medicine</i>, 12(3), 234-246.
                          </span>
                        </li>
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="images" className="m-0 p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Original Chest X-ray</h3>
                <div className="border rounded-md p-1 shadow-sm">
                  <div className="aspect-[4/3] bg-slate-100 rounded flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground">
                        Placeholder for actual patient image
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Patient images not displayed in prototype
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">AI-Highlighted Abnormalities</h3>
                  <div className="border rounded-md p-1 shadow-sm">
                    <div className="aspect-square bg-slate-100 rounded flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">
                          AI analysis visualization
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Regional Distribution</h3>
                  <div className="border rounded-md overflow-hidden">
                    <div className="h-[250px]">
                      <PieChart 
                        data={[
                          { name: "Right Lower", value: 78 },
                          { name: "Right Middle", value: 22 },
                          { name: "Right Upper", value: 15 },
                          { name: "Left Lower", value: 8 },
                          { name: "Left Upper", value: 5 },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Comparison to Reference Images</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-md p-1 shadow-sm">
                    <div className="aspect-square bg-slate-100 rounded flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Normal Chest X-ray</p>
                    </div>
                  </div>
                  <div className="border rounded-md p-1 shadow-sm">
                    <div className="aspect-square bg-slate-100 rounded flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Typical Lobar Pneumonia</p>
                    </div>
                  </div>
                  <div className="border rounded-md p-1 shadow-sm">
                    <div className="aspect-square bg-slate-100 rounded flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Patient Image</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="m-0 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-medical-success mr-2" />
                    <h3 className="text-lg font-medium">Recommended Follow-up</h3>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-4">
                        {sampleResults.recommendedFollowUp.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-6 w-6 flex items-center justify-center rounded-full bg-medical-primary/10 text-medical-primary mr-3 flex-shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{rec}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-medical-warning mr-2" />
                    <h3 className="text-lg font-medium">Potential Complications to Monitor</h3>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-medical-warning/10 text-medical-warning mr-3 flex-shrink-0">
                            !
                          </div>
                          <div>
                            <p className="font-medium">Pleural Effusion</p>
                            <p className="text-sm text-muted-foreground">
                              Monitor for development of fluid in the pleural space
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-medical-warning/10 text-medical-warning mr-3 flex-shrink-0">
                            !
                          </div>
                          <div>
                            <p className="font-medium">Lung Abscess</p>
                            <p className="text-sm text-muted-foreground">
                              Watch for persistent fever or worsening symptoms
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-medical-warning/10 text-medical-warning mr-3 flex-shrink-0">
                            !
                          </div>
                          <div>
                            <p className="font-medium">Respiratory Failure</p>
                            <p className="text-sm text-muted-foreground">
                              Monitor oxygen saturation and respiratory rate
                            </p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-medical-primary mr-2" />
                    <h3 className="text-lg font-medium">Treatment Considerations</h3>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Antimicrobial Therapy</h4>
                          <div className="bg-muted/50 p-3 rounded-md text-sm">
                            <p>Consider empiric coverage for common causes of community-acquired pneumonia:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              <li>Streptococcus pneumoniae</li>
                              <li>Haemophilus influenzae</li>
                              <li>Atypical pathogens (if clinically suspected)</li>
                            </ul>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Supportive Care</h4>
                          <div className="bg-muted/50 p-3 rounded-md text-sm">
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Ensure adequate oxygenation</li>
                              <li>Antipyretics for fever control</li>
                              <li>Maintain hydration</li>
                              <li>Consider pulmonary rehabilitation for severe cases</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-medical-secondary mr-2" />
                    <h3 className="text-lg font-medium">Follow-up Timeline</h3>
                  </div>
                  <Card>
                    <CardContent className="pt-6 pb-2">
                      <div className="relative">
                        <div className="absolute h-full w-px bg-border left-[7px]"></div>
                        <ol className="space-y-6">
                          <li className="flex gap-3">
                            <div className="h-4 w-4 rounded-full bg-medical-primary mt-1 relative z-10"></div>
                            <div className="space-y-1 pb-6">
                              <div className="flex items-center text-sm font-medium">Immediate</div>
                              <p className="text-sm">
                                Begin prescribed antibiotics and monitor symptoms
                              </p>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <div className="h-4 w-4 rounded-full bg-medical-primary mt-1 relative z-10"></div>
                            <div className="space-y-1 pb-6">
                              <div className="flex items-center text-sm font-medium">2-3 Days</div>
                              <p className="text-sm">
                                Clinical assessment to ensure improvement in symptoms
                              </p>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <div className="h-4 w-4 rounded-full bg-medical-primary mt-1 relative z-10"></div>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm font-medium">2 Weeks</div>
                              <p className="text-sm">
                                Follow-up chest X-ray to confirm resolution
                              </p>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-between p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm">
                <Info className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">AI assisted diagnosis</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                This analysis was generated by the MedInsight AI system. All diagnostic suggestions should be reviewed by a qualified healthcare professional.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="default" className="bg-medical-primary hover:bg-medical-primary/90">
          Approve & Save to Patient Record
        </Button>
      </CardFooter>
    </Card>
  );
}
