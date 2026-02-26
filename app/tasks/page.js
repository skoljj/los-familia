"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getSupabaseBrowser } from "@/lib/supabase-client";
import NavBar from "@/components/NavBar";
import FamilyMemberPicker from "@/components/FamilyMemberPicker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DAY_SECTIONS = ["morning", "afternoon", "evening"];
const REPEAT_OPTIONS = ["none", "daily", "weekdays", "weekly"];

export default function TasksPage() {
  const { member, family, loading, isParent } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState({
    title: "",
    day_section: "morning",
    time_allowed_minutes: 10,
    star_value: 1,
    repeat: "none",
    sort_order: 0,
  });

  useEffect(() => {
    if (!loading && !member) router.replace("/login");
    if (!loading && member && !isParent) router.replace("/timeline");
  }, [member, loading, isParent, router]);

  const loadChildren = useCallback(async () => {
    if (!family) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase
      .from("family_members")
      .select("*")
      .eq("family_id", family.id)
      .eq("role", "child")
      .order("name");
    if (data) {
      setChildren(data);
      if (!selectedChild && data.length > 0) setSelectedChild(data[0].id);
    }
  }, [family, selectedChild]);

  const loadTasks = useCallback(async () => {
    if (!selectedChild || !family) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("family_id", family.id)
      .eq("assigned_to", selectedChild)
      .eq("task_date", new Date().toISOString().split("T")[0])
      .order("day_section")
      .order("sort_order");
    if (data) setTasks(data);
  }, [selectedChild, family]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  function openCreate() {
    setEditingTask(null);
    setForm({
      title: "",
      day_section: "morning",
      time_allowed_minutes: 10,
      star_value: 1,
      repeat: "none",
      sort_order: tasks.length,
    });
    setDialogOpen(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      day_section: task.day_section,
      time_allowed_minutes: task.time_allowed_minutes,
      star_value: task.star_value,
      repeat: task.repeat,
      sort_order: task.sort_order,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    if (editingTask) {
      await supabase
        .from("tasks")
        .update(form)
        .eq("id", editingTask.id);
    } else {
      await supabase.from("tasks").insert({
        ...form,
        family_id: family.id,
        assigned_to: selectedChild,
        task_date: new Date().toISOString().split("T")[0],
      });
    }

    setDialogOpen(false);
    loadTasks();
  }

  async function handleDelete(taskId) {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    await supabase.from("tasks").delete().eq("id", taskId);
    loadTasks();
  }

  if (!member || !family) return null;

  const grouped = DAY_SECTIONS.map((section) => ({
    section,
    tasks: tasks.filter((t) => t.day_section === section),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <NavBar />
      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Tasks</h1>
          <Button onClick={openCreate}>+ New Task</Button>
        </div>

        <FamilyMemberPicker
          members={children}
          selectedId={selectedChild}
          onSelect={setSelectedChild}
        />

        {grouped.map(({ section, tasks: sectionTasks }) => (
          <div key={section}>
            <h3 className="font-semibold capitalize text-lg mb-2">{section}</h3>
            {sectionTasks.length === 0 && (
              <p className="text-sm text-muted-foreground mb-2">No tasks</p>
            )}
            <div className="space-y-2">
              {sectionTasks.map((t) => (
                <Card key={t.id}>
                  <CardContent className="flex items-center justify-between p-3">
                    <div className="flex-1">
                      <span className="font-medium">{t.title}</span>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {t.time_allowed_minutes}m
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {"*".repeat(t.star_value)} star{t.star_value !== 1 ? "s" : ""}
                        </Badge>
                        {t.repeat !== "none" && (
                          <Badge variant="secondary" className="text-xs">
                            {t.repeat}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(t)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(t.id)}
                      >
                        Del
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Create / Edit dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Edit Task" : "New Task"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Brush teeth"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Section</Label>
                  <select
                    className="w-full border rounded-md h-10 px-3 text-sm"
                    value={form.day_section}
                    onChange={(e) =>
                      setForm({ ...form, day_section: e.target.value })
                    }
                  >
                    {DAY_SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Time (minutes)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.time_allowed_minutes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        time_allowed_minutes: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Stars</Label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={form.star_value}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        star_value: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Repeat</Label>
                  <select
                    className="w-full border rounded-md h-10 px-3 text-sm"
                    value={form.repeat}
                    onChange={(e) =>
                      setForm({ ...form, repeat: e.target.value })
                    }
                  >
                    {REPEAT_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingTask ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
