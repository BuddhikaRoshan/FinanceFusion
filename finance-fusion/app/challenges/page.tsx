"use client";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

interface Challenge {
  id: string;
  challenge: string;
  challengeEnd: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
}

type ChallengeFormData = {
  id?: string;
  challenge: string;
  challengeEnd: Date | null;
};

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeFormData>({
    challenge: "",
    challengeEnd: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch all challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("/api/challenges");
        if (!response.ok) throw new Error("Failed to fetch challenges");
        const data = await response.json();
        setChallenges(data);

        setFilteredChallenges(
          data.filter(
            (challenge: Challenge) =>
              challenge.userId === localStorage.getItem("userId")
          )
        );
        setChallenges(
          data.filter(
            (challenge: Challenge) =>
              challenge.userId === localStorage.getItem("userId")
          )
        );
      } catch (error) {
        toast.error("Error loading challenges");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Filter challenges based on search term
  useEffect(() => {
    const filtered = challenges.filter((challenge) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        challenge.challenge.toLowerCase().includes(searchLower) ||
        (challenge.challengeEnd &&
          format(new Date(challenge.challengeEnd), "PPP")
            .toLowerCase()
            .includes(searchLower))
      );
    });
    setFilteredChallenges(filtered);
  }, [searchTerm, challenges]);

  // Generate AI challenges
  const generateChallenges = async () => {
    setIsGenerating(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const response = await fetch("/api/openai-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to generate challenges");

      const generatedChallenges = await response.json();
      toast.success("Generated new challenges successfully");
      setChallenges((prev) => [...generatedChallenges, ...prev]);
    } catch (error) {
      toast.error("Error generating challenges");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!currentChallenge.challenge.trim()) {
      toast.error("Challenge description is required");
      return;
    }

    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const payload = {
        challenge: currentChallenge.challenge,
        userId,
        challengeEnd: currentChallenge.challengeEnd?.toISOString() || null,
      };

      let response: Response;
      let isUpdate = false;

      if (isEditMode && currentChallenge.id) {
        // Update existing challenge
        response = await fetch(`/api/challenges/${currentChallenge.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        isUpdate = true;
      } else {
        // Create new challenge
        response = await fetch("/api/challenges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok)
        throw new Error(isUpdate ? "Update failed" : "Creation failed");

      await response.json();
      toast.success(
        isUpdate
          ? "Challenge updated successfully"
          : "Challenge created successfully"
      );

      const responseChallenge = await fetch("/api/challenges");
      if (!responseChallenge.ok) throw new Error("Failed to fetch challenges");
      const data = await responseChallenge.json();
      setChallenges(
        data.filter(
          (challenge: Challenge) =>
            challenge.userId === localStorage.getItem("userId")
        )
      );
      setFilteredChallenges(
        data.filter(
          (challenge: Challenge) =>
            challenge.userId === localStorage.getItem("userId")
        )
      );
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        isEditMode ? "Error updating challenge" : "Error creating challenge"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Challenge deleted successfully");
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      toast.error("Error deleting challenge");
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setCurrentChallenge({
      challenge: "",
      challengeEnd: null,
    });
    setIsEditMode(false);
  };

  // Open edit dialog
  const openEditDialog = (challenge: Challenge) => {
    setCurrentChallenge({
      id: challenge.id,
      challenge: challenge.challenge,
      challengeEnd: challenge.challengeEnd
        ? new Date(challenge.challengeEnd)
        : null,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const completeChallenge = async (challenge: Challenge) => {
    try {
      await fetch("/api/challenges/" + challenge.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: true,
        }),
      });
      toast.success("Challenge successfull,congrats you earned 10 points");
      const responseChallenge = await fetch("/api/challenges");
      if (!responseChallenge.ok) throw new Error("Failed to fetch challenges");
      const data = await responseChallenge.json();
      setChallenges(
        data.filter(
          (challenge: Challenge) =>
            challenge.userId === localStorage.getItem("userId")
        )
      );
      setFilteredChallenges(
        data.filter(
          (challenge: Challenge) =>
            challenge.userId === localStorage.getItem("userId")
        )
      );
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error while completing the challenge");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <Navbar />
      <Toaster richColors position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Financial Challenges
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={generateChallenges}
              disabled={isGenerating}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Generating...
                </div>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  AI Suggestions
                </>
              )}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Challenge
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {isEditMode ? "Edit Challenge" : "Add New Challenge"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="challenge"
                      className="text-right text-white"
                    >
                      Description
                    </Label>
                    <Input
                      id="challenge"
                      name="challenge"
                      value={currentChallenge.challenge}
                      onChange={(e) =>
                        setCurrentChallenge((prev) => ({
                          ...prev,
                          challenge: e.target.value,
                        }))
                      }
                      className="col-span-3 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="challengeEnd"
                      className="text-right text-white"
                    >
                      End Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "col-span-3 justify-start text-left font-normal bg-gray-700 border-gray-600",
                            !currentChallenge.challengeEnd &&
                              "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {currentChallenge.challengeEnd ? (
                            <p className="text-white">
                              {format(currentChallenge.challengeEnd, "PPP")}
                            </p>
                          ) : (
                            <span>Pick a date (optional)</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                        <Calendar
                          mode="single"
                          selected={currentChallenge.challengeEnd || undefined}
                          onSelect={(date) =>
                            setCurrentChallenge((prev) => ({
                              ...prev,
                              challengeEnd: date || null,
                            }))
                          }
                          initialFocus
                          className="bg-gray-800 text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                    onClick={handleSubmit}
                  >
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700"
          >
            <p className="text-gray-400">
              {searchTerm
                ? "No matching challenges found"
                : "No challenges created yet"}
            </p>
            <Button
              onClick={generateChallenges}
              className="mt-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"
            >
              Generate AI Suggestions
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-gray-300">Challenge</TableHead>
                  <TableHead className="text-gray-300">End Date</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChallenges.map((challenge) => (
                  <motion.tr
                    key={challenge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-gray-700 hover:bg-gray-700/30"
                  >
                    <TableCell className="font-medium text-white max-w-[300px] whitespace-normal break-words">
                      {challenge.challenge}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {challenge.challengeEnd
                        ? format(new Date(challenge.challengeEnd), "PPP")
                        : "No end date"}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {format(
                        new Date(
                          challenge.createdAt ?? new Date().toDateString()
                        ),
                        "PP"
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={challenge.completed}
                        className="border-gray-600 hover:bg-gray-700 text-black"
                        onClick={() => {
                          completeChallenge(challenge);
                        }}
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-700 text-black"
                        onClick={() => openEditDialog(challenge)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500"
                        onClick={() => handleDelete(challenge.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;
