import Link from "next/link"
import Image from "next/image"
import { ArrowDownToLine, Download, ShieldCheck, Terminal } from "lucide-react"
import changelogs from "@/data/changelogs.json"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

type ChangelogsMap = Record<string, string[]>

function loadLatestChangelogItems(): string[] {
  const map = changelogs as ChangelogsMap
  const versions = Object.keys(map)
  if (versions.length === 0) return []
  const latest = versions.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))[0]
  return map[latest] ?? []
}

export default function Home() {
  const changelogItems = loadLatestChangelogItems()
  const supportedBuilds = [
    {
      label: "GTA5 Enhanced",
      description: "Build 1.0.889.22",
      status: "Supported",
    },
    {
      label: "GTA5 Legacy",
      description: "Build 1.0.3586.0",
      status: "Supported",
    },
    {
      label: "FiveM Client",
      description: "Enforced game build 3258",
      status: "Verified",
    },
  ] as const
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <section className="grid gap-10 md:grid-cols-2 md:gap-14 items-start">
        <div className="space-y-6">
          <div className="pt-2">
            <Image
              src="/trainer.png"
              alt="Rampage Trainer logo"
              width={520}
              height={520}
              className="opacity-90 w-[360px] h-auto sm:w-[440px] md:w-[420px] rounded-[6px]"
              priority
            />
          </div>
          {/** Intentionally no text/buttons here; moved to the right column below the supported builds card. */}
        </div>
        <div className="self-start mt-6 md:mt-10 flex flex-col gap-6">
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4" /> Supported Gamebuilds
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-4">
              {supportedBuilds.map((build) => (
                <div key={build.label} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{build.label}</div>
                    <div className="text-muted-foreground">{build.description}</div>
                  </div>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">{build.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="size-4" /> PowerShell Quick Install
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p className="text-muted-foreground">
                Use the Windows 11 PowerShell script in the README to download ScriptHookV, copy <code>Rampage.asi</code>, and mirror the trainer into FiveM&apos;s <code>plugins</code> folder.
              </p>
              <Link
                href="https://github.com/rampage-trainer/gta5/blob/main/README.md#rampage-trainer-asi-installation-guide"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowDownToLine className="size-4" /> Jump to full tutorial
              </Link>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground max-w-prose">
              Modern trainer with a minimal UI. Download beta builds, read changelogs, and follow install instructions tailored for GTA V and FiveM build 3258.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://raw.githubusercontent.com/rampage-trainer/gta5/main/build/Rampage_Enhanced.zip"
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                <Download className="size-4" /> Download Enhanced Beta
              </Link>
              <Link
                href="https://raw.githubusercontent.com/rampage-trainer/gta5/main/build/Rampage_Legacy.zip"
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
              >
                <Download className="size-4" /> Download Legacy Beta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-10" />

      <section className="grid gap-10 md:grid-cols-2 items-start">
        <div id="install" className="grid gap-6 max-w-prose w-full">
          <h2 className="text-xl font-semibold tracking-tight">Install Instructions</h2>
          <ol className="list-decimal list-outside pl-5 space-y-2 text-sm">
            <li>Download either the Enhanced or Legacy beta package.</li>
            <li>Follow the README PowerShell tutorial to install ScriptHookV and Rampage.</li>
            <li>Verify <code>Rampage.asi</code> and <code>RampageFiles</code> exist in both GTA V and FiveM&apos;s <code>plugins</code> folder.</li>
            <li>Launch GTA V or FiveM (build 3258) and press <kbd>F4</kbd> to open the trainer.</li>
          </ol>
          <p className="text-xs text-muted-foreground">
            Always merge new RampageFiles with your existing folder when updating, especially if you keep FiveM client overrides.
          </p>
        </div>

        <div id="changelog" className="grid gap-6">
          <h2 className="text-xl font-semibold tracking-tight">Changelog</h2>
          <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
            {changelogItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
