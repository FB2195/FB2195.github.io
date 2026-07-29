import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ScreenContainer from '../components/ScreenContainer';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { colors } from '../theme/colors';
import { Survey } from '../types';
import { formatDateShort } from '../utils/date';

const AUDIENCE_LABEL: Record<Survey['audience'], string> = {
  eltern_jugend: 'Eltern der Jugendspieler',
  spieler_mannschaft: 'Spieler der Mannschaft',
};

const SurveysScreen: React.FC = () => {
  const { isYouthParent, isSeniorPlayer, isFunktionaer } = useAuth();
  const { surveys, votedSurveyIds, voteSurvey } = useData();

  const elternSurveys = surveys.filter((s) => s.audience === 'eltern_jugend');
  const spielerSurveys = surveys.filter((s) => s.audience === 'spieler_mannschaft');

  const canVote = (audience: Survey['audience']) =>
    (audience === 'eltern_jugend' && isYouthParent) || (audience === 'spieler_mannschaft' && isSeniorPlayer);

  const renderGroup = (title: string, list: Survey[], audience: Survey['audience']) => {
    if (list.length === 0) return null;
    return (
      <View style={{ marginBottom: 8 }}>
        <SectionHeader title={title} />
        {list.map((survey) => (
          <SurveyCard
            key={survey.id}
            survey={survey}
            canVote={canVote(audience)}
            hasVoted={votedSurveyIds.includes(survey.id)}
            onVote={(optionId) => voteSurvey(survey.id, optionId)}
          />
        ))}
      </View>
    );
  };

  if (isFunktionaer) {
    return (
      <ScreenContainer>
        {renderGroup(AUDIENCE_LABEL.eltern_jugend, elternSurveys, 'eltern_jugend')}
        {renderGroup(AUDIENCE_LABEL.spieler_mannschaft, spielerSurveys, 'spieler_mannschaft')}
      </ScreenContainer>
    );
  }

  if (isYouthParent) {
    return (
      <ScreenContainer>
        {elternSurveys.length === 0 ? (
          <EmptyState title="Aktuell keine Umfragen für Eltern" />
        ) : (
          elternSurveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              canVote
              hasVoted={votedSurveyIds.includes(survey.id)}
              onVote={(optionId) => voteSurvey(survey.id, optionId)}
            />
          ))
        )}
      </ScreenContainer>
    );
  }

  if (isSeniorPlayer) {
    return (
      <ScreenContainer>
        {spielerSurveys.length === 0 ? (
          <EmptyState title="Aktuell keine Umfragen für die Mannschaft" />
        ) : (
          spielerSurveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              canVote
              hasVoted={votedSurveyIds.includes(survey.id)}
              onVote={(optionId) => voteSurvey(survey.id, optionId)}
            />
          ))
        )}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <EmptyState
        title="Für dich sind aktuell keine Umfragen freigeschaltet"
        subtitle="Umfragen gibt es für Eltern von Jugendspielern und für Spieler der 1. Mannschaft."
      />
    </ScreenContainer>
  );
};

const SurveyCard: React.FC<{
  survey: Survey;
  canVote: boolean;
  hasVoted: boolean;
  onVote: (optionId: string) => void;
}> = ({ survey, canVote, hasVoted, onVote }) => {
  const totalVotes = survey.options.reduce((sum, o) => sum + o.votes, 0) || 1;

  return (
    <Card style={{ marginBottom: 12 }}>
      <Text style={styles.title}>{survey.title}</Text>
      <Text style={styles.description}>{survey.description}</Text>
      <Text style={styles.deadline}>Ende der Abstimmung: {formatDateShort(survey.deadline)}</Text>

      <View style={{ marginTop: 12 }}>
        {survey.options.map((option) => {
          const percent = Math.round((option.votes / totalVotes) * 100);
          const disabled = !canVote || hasVoted;
          return (
            <TouchableOpacity
              key={option.id}
              disabled={disabled}
              onPress={() => onVote(option.id)}
              style={styles.optionRow}
            >
              <View style={styles.optionBarBackground}>
                <View style={[styles.optionBarFill, { width: `${percent}%` }]} />
                <View style={styles.optionTextRow}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionPercent}>{percent}% · {option.votes}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {!canVote ? (
        <Text style={styles.hint}>Nur sichtbar für Verwaltung/Zielgruppe – Stimmabgabe nicht möglich.</Text>
      ) : hasVoted ? (
        <Text style={styles.hint}>Danke für deine Stimme!</Text>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  deadline: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    fontWeight: '600',
  },
  optionRow: {
    marginBottom: 8,
  },
  optionBarBackground: {
    backgroundColor: colors.background,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionBarFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: `${colors.primary}25`,
  },
  optionTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
  },
  optionPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginLeft: 8,
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default SurveysScreen;
