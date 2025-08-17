"use client";

import { useState, useRef } from "react";
import { University } from "@/data/universities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface SuggestUniversityDialogProps {
  customUniversities: University[];
  setCustomUniversities: (universities: University[]) => void;
}

export function SuggestUniversityDialog({
  customUniversities,
  setCustomUniversities,
}: SuggestUniversityDialogProps) {
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const handleSuggestUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/suggest-university", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ suggestion }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit suggestion");
      }

      toast({
        title: "Suggestion Sent",
        description:
          "Thank you for suggesting a university. We'll review it soon!",
        duration: 5000,
      });

      setSuggestion("");
      dialogCloseRef.current?.click();
    } catch (error) {
      console.error("Error suggesting university:", error);
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center justify-center space-y-3 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 w-full h-36 group">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-2xl">🎓</span>
          </div>
          <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
            Suggest a University
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Suggest a University</DialogTitle>
          <DialogDescription>
            Help us expand our database by suggesting a university to add.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSuggestUniversity} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="suggestion">University Name or Domain</Label>
            <Input
              id="suggestion"
              placeholder="e.g., Stanford University or stanford.edu"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
            />
          </div>
          <DialogClose ref={dialogCloseRef} className="hidden" />
          <Button
            type="submit"
            disabled={!suggestion || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Suggestion"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
